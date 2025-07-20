import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FaUserCircle } from 'react-icons/fa';
import api from '../services/api';

const UserManagement = () => {
  const [passengers, setPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const res = await api.get('/passenger');
        setPassengers(res.data);
      } catch (err) {
        console.error('Failed to fetch passengers:', err);
      }
    };

    fetchPassengers();
  }, []);

  const filteredPassengers = passengers.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />

        {/* Search */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 rounded-xl border border-orange-200 overflow-x-auto">
          <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
            <table className="w-full table-fixed border-collapse">
              <thead
                className="bg-[#F67F00] text-white text-lg"
                style={{ position: 'sticky', top: 0, zIndex: 10 }}
              >
                <tr>
                  <th className="p-3 w-[120px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}></th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>First Name</th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Last Name</th>
                  <th className="p-3 w-[220px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredPassengers.map((user, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t"
                    style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}
                  >
                    <td className="p-3 w-[120px] text-center border-r">
                      <FaUserCircle className="text-2xl text-[#BD2D01] mx-auto" />
                    </td>
                    <td className="p-3 w-[160px] border-r">{user.firstName}</td>
                    <td className="p-3 w-[160px] border-r">{user.lastName}</td>
                    <td className="p-3 w-[220px] border-r">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
