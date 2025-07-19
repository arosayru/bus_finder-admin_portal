import React, { useState, useEffect } from 'react';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';

const AddShiftModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    numberPlate: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    reverseDepartureTime: '',
    reverseArrivalTime: '',
    reverseDate: ''
  });

  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [showReverse, setShowReverse] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const to24Hour = (time) => (time?.length === 5 ? `${time}:00` : time);

    const payload = {
      shiftId: `shift_${Date.now()}`,
      routeNo: form.routeNo,
      numberPlate: form.numberPlate,
      normal: {
        startTime: to24Hour(form.departureTime),
        endTime: to24Hour(form.arrivalTime),
        date: form.date
      },
      reverse: showReverse
        ? {
            startTime: to24Hour(form.reverseDepartureTime),
            endTime: to24Hour(form.reverseArrivalTime),
            date: form.reverseDate
          }
        : null
    };

    try {
      await api.post('/busshift', payload);
      onAdd({ ...form, shiftId: payload.shiftId });
      onClose();
    } catch (error) {
      console.error('Failed to add shift:', error);
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
        <h2 className="text-white text-xl font-bold mb-6 text-center">Add Shift</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Number */}
          <div className="relative">
            <label
              htmlFor="numberPlate"
              className={`absolute left-3 transition-all duration-300 ${
                form.numberPlate ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
              }`}
            >
              Vehicle No
            </label>
            <input
              type="text"
              name="numberPlate"
              value={form.numberPlate}
              onChange={handleChange}
              placeholder="Vehicle No"
              className="w-full p-3 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
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

          {/* Route No and Route Name */}
          <div className="flex gap-4 relative">
            <div className="flex-1 relative">
              <label
                htmlFor="routeNo"
                className={`absolute left-3 transition-all duration-300 ${
                  form.routeNo ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
                }`}
              >
                Route No
              </label>
              <input
                type="text"
                name="routeNo"
                value={form.routeNo}
                onChange={handleChange}
                placeholder="Route No"
                className="w-full p-3 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
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

            <div className="flex-1 relative">
              <label
                htmlFor="routeName"
                className={`absolute left-3 transition-all duration-300 ${
                  form.routeName ? 'top-[-15px] text-xs text-white' : 'top-1/2 transform -translate-y-1/2 text-[#7E7573]'
                }`}
              >
                Route Name
              </label>
              <input
                type="text"
                name="routeName"
                value={form.routeName}
                onChange={handleChange}
                placeholder="Route Name"
                className="w-full p-3 rounded-md bg-orange-50 placeholder-transparent text-black focus:outline-none"
                readOnly
              />
            </div>
          </div>

          {/* Departure and Arrival Times */}
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

          {/* Reverse Trip Section */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowReverse((prev) => !prev)}
              className="mt-4 px-6 py-2 rounded-md text-white font-semibold bg-[#BD2D01]"
            >
              {showReverse ? 'Remove Return Trip' : 'Add Return Trip'}
            </button>
          </div>

          {showReverse && (
            <div className="mt-6 space-y-4">
              <h3 className="text-white text-lg font-bold">Return Trip</h3>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <label className="text-white">Departure Time</label>
                  <input
                    type="time"
                    name="reverseDepartureTime"
                    value={form.reverseDepartureTime}
                    onChange={handleChange}
                    step="60"
                    className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
                  />
                </div>
                <div className="relative flex-1">
                  <label className="text-white">Arrival Time</label>
                  <input
                    type="time"
                    name="reverseArrivalTime"
                    value={form.reverseArrivalTime}
                    onChange={handleChange}
                    step="60"
                    className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-white">Date</label>
                <input
                  type="date"
                  name="reverseDate"
                  value={form.reverseDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-orange-50 text-black focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Add
            </button>
          </div>
        </form>

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

export default AddShiftModal;
