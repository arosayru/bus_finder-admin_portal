import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

const EditShiftModal = ({ shift, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...shift });
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);

  useEffect(() => {
    setForm({ ...shift });
  }, [shift]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, busRes] = await Promise.all([
          api.get('/busroute'),
          api.get('/bus'),
        ]);
        setRoutes(routeRes.data || []);
        setBuses(busRes.data || []);
      } catch (error) {
        console.error('Failed to fetch routes or buses:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    if (name === 'routeNo') {
      const match = routes.find((r) => r.routeNumber === value);
      updatedForm.routeName = match ? match.routeName : '';
      const filtered = routes.filter((r) =>
        r.routeNumber.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRoutes(filtered);
    }

    if (name === 'numberPlate') {
      const filtered = buses.filter((b) =>
        b.numberPlate.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBuses(filtered);

      const match = buses.find((b) => b.numberPlate.toLowerCase() === value.toLowerCase());
      if (match) {
        updatedForm.routeNo = match.busRouteNumber;
        const routeMatch = routes.find((r) => r.routeNumber === match.busRouteNumber);
        updatedForm.routeName = routeMatch ? routeMatch.routeName : '';
      }
    }

    setForm(updatedForm);
  };

  const handleBusSuggestionClick = (bus) => {
    const routeMatch = routes.find((r) => r.routeNumber === bus.busRouteNumber);
    setForm({
      ...form,
      numberPlate: bus.numberPlate,
      routeNo: bus.busRouteNumber,
      routeName: routeMatch ? routeMatch.routeName : '',
    });
    setFilteredBuses([]);
  };

  const handleSuggestionClick = (route) => {
    setForm({
      ...form,
      routeNo: route.routeNumber,
      routeName: route.routeName,
    });
    setFilteredRoutes([]);
  };

  const to24Hour = (time) => {
    return time?.length === 5 ? `${time}:00` : time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      routeNo: form.routeNo,
      numberPlate: form.numberPlate,
      startTime: to24Hour(form.departureTime),
      endTime: to24Hour(form.arrivalTime),
      date: form.date,
    };

    try {
      await api.put(`/busshift/${form.shiftId}`, payload);
      onUpdate({
        ...form,
        ...payload,
        departureTime: payload.startTime,
        arrivalTime: payload.endTime,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update shift:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-xl p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        {/* Header */}
        <h2 className="text-white text-xl font-bold mb-6 text-center">Edit Shift</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Number Plate Field with Suggestions */}
          <div className="relative">
            <input
              type="text"
              name="numberPlate"
              value={form.numberPlate || ''}
              onChange={handleChange}
              placeholder="Vehicle No (Number Plate)"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
              autoComplete="off"
            />
            {filteredBuses.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow rounded-md z-20 max-h-40 overflow-y-auto">
                {filteredBuses.map((bus, i) => (
                  <div
                    key={i}
                    onClick={() => handleBusSuggestionClick(bus)}
                    className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-sm"
                  >
                    {bus.numberPlate} (Route {bus.busRouteNumber})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route Inputs with Autocomplete */}
          <div className="flex gap-4 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                name="routeNo"
                value={form.routeNo}
                onChange={handleChange}
                placeholder="Route No"
                className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
                autoComplete="off"
              />
              {filteredRoutes.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow rounded-md z-20 max-h-40 overflow-y-auto">
                  {filteredRoutes.map((route, i) => (
                    <div
                      key={i}
                      onClick={() => handleSuggestionClick(route)}
                      className="px-4 py-2 cursor-pointer hover:bg-orange-100 text-sm"
                    >
                      {route.routeNumber} - {route.routeName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              name="routeName"
              value={form.routeName}
              onChange={handleChange}
              placeholder="Route Name"
              readOnly
              className="flex-1 p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
            />
          </div>

          {/* Time Fields */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <label className="text-white">Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                step="60"
                className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
              />
            </div>
            <div className="relative flex-1">
              <label className="text-white">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                step="60"
                className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="text-white">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Update
            </button>
          </div>
        </form>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default EditShiftModal;
