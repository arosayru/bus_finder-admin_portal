import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AddBusModal = ({ onClose, onBusAdded }) => {
  const [form, setForm] = useState({
    routeNo: '',
    vehicleNo: '',
    busType: 'CTB',
    driverId: '',
    conductorId: '',
  });

  const [driverPhone, setDriverPhone] = useState('');
  const [conductorPhone, setConductorPhone] = useState('');
  const [routeSuggestions, setRouteSuggestions] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    api.get('/busroute')
      .then(res => {
        const routes = Array.isArray(res.data) ? res.data : res.data.data || [];
        const normalRoutes = routes.filter(route => !route.routeNumber?.endsWith('R')); // filter out reverse routes
        console.log('Loaded Normal Routes:', normalRoutes);
        setRouteSuggestions(normalRoutes);
      })
      .catch(err => console.error('Failed to load routes:', err));

    api.get('/staff')
      .then(res => setStaffList(res.data || []))
      .catch(err => console.error('Failed to load staff:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectDriver = (e) => {
    const selectedId = e.target.value;
    const driver = staffList.find(s => s.staffId === selectedId);
    setForm({ ...form, driverId: selectedId });
    setDriverPhone(driver?.telNo || '');
  };

  const handleSelectConductor = (e) => {
    const selectedId = e.target.value;
    const conductor = staffList.find(s => s.staffId === selectedId);
    setForm({ ...form, conductorId: selectedId });
    setConductorPhone(conductor?.telNo || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        NumberPlate: form.vehicleNo,
        BusType: form.busType,
        DriverId: form.driverId,
        ConductorId: form.conductorId,
        BusRouteNumber: form.routeNo,
      };
      const response = await api.post('/bus', payload);
      if (response.status === 200 || response.status === 201) {
        onBusAdded(response.data);
        onClose();
      }
    } catch (err) {
      console.error('Error adding bus:', err);
    }
  };

  const driverOptions = staffList.filter(s => s.staffRole === 'Driver');
  const conductorOptions = staffList.filter(s => s.staffRole === 'Conductor');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl relative"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-xl font-bold mb-4">Add Bus</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Route Number */}
          <select
            name="routeNo"
            value={form.routeNo}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          >
            <option value="">Select Route No</option>
            {routeSuggestions.map((route, index) => (
              <option
                key={`${route.routeId}-${index}`}
                value={route.routeNumber}
              >
                {route.routeNumber || 'Unknown'} - {route.routeName || 'Unnamed'}
              </option>
            ))}
          </select>

          {/* Vehicle Number */}
          <input
            type="text"
            name="vehicleNo"
            value={form.vehicleNo}
            onChange={handleChange}
            placeholder="Vehicle No"
            className="w-full p-3 rounded-md bg-orange-50 placeholder-[#7E7573] text-black focus:outline-none"
          />

          {/* Bus Type */}
          <select
            name="busType"
            value={form.busType}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          >
            <option value="CTB">CTB</option>
            <option value="Luxury">Luxury</option>
            <option value="Semi-Luxury">Semi-Luxury</option>
          </select>

          {/* Driver */}
          <select
            name="driverId"
            value={form.driverId}
            onChange={handleSelectDriver}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          >
            <option value="">Select Driver</option>
            {driverOptions.map(d => (
              <option key={d.staffId} value={d.staffId}>
                {d.firstName} {d.lastName}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={driverPhone}
            disabled
            placeholder="Driver's Phone"
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />

          {/* Conductor */}
          <select
            name="conductorId"
            value={form.conductorId}
            onChange={handleSelectConductor}
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          >
            <option value="">Select Conductor</option>
            {conductorOptions.map(c => (
              <option key={c.staffId} value={c.staffId}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={conductorPhone}
            disabled
            placeholder="Conductor's Phone"
            className="w-full p-3 rounded-md bg-orange-50 text-black placeholder-[#7E7573] focus:outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-2 px-6 py-2 rounded-md text-white font-semibold"
              style={{ background: '#CF4602' }}
            >
              Add
            </button>
          </div>
        </form>

        {/* Close button */}
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

export default AddBusModal;
