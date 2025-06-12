import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddUserModal from '../components/AddUserModal';
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);

  const users = Array(12).fill({
    firstName: 'John',
    lastName: 'Rubic',
    username: 'john99',
    email: 'john@gmail.com',
    password: '********',
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />

        {/* Page Title & Search */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{
                background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
              }}
            >
              Search
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-md"
            style={{
              background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
            }}
            onClick={() => setShowModal(true)}
          >
            Add <FaPlus />
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-orange-200">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-[#F67F00] text-white text-lg">
              <tr>
                <th className="p-3 w-[60px]"> </th>
                <th className="p-3 w-[160px]">First Name</th>
                <th className="p-3 w-[160px]">Last Name</th>
                <th className="p-3 w-[160px]">Username</th>
                <th className="p-3 w-[240px]">Email</th>
                <th className="p-3 w-[140px]">Password</th>
                <th className="p-3 w-[120px]">Action</th>
              </tr>
            </thead>
          </table>

          {/* Scrollable tbody wrapped in div */}
          <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
            <table className="w-full table-fixed border-collapse">
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition">
                    <td className="p-3 w-[120px] text-center">
                      <FaUserCircle className="text-2xl text-[#BD2D01]" />
                    </td>
                    <td className="p-3 w-[160px]">{user.firstName}</td>
                    <td className="p-3 w-[160px]">{user.lastName}</td>
                    <td className="p-3 w-[180px]">{user.username}</td>
                    <td className="p-3 w-[220px]">{user.email}</td>
                    <td className="p-3 w-[130px]">{user.password}</td>
                    <td className="p-3 w-[90px]">
                      <div className="flex justify-center gap-3 text-[#BD2D01]">
                        <FaEdit className="cursor-pointer text-[#2C44BB]" />
                        <FaTrash className="cursor-pointer text-[#BD1111]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && <AddUserModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default UserManagement;
