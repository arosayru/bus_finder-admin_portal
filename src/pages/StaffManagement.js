import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddStaffModal from '../components/AddStaffModal';
import EditStaffModal from '../components/EditStaffModal';
import DeleteStaffModal from '../components/DeleteStaffModal';
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';

const StaffManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);

  const staffList = Array(10).fill({
    firstName: 'John',
    lastName: 'Rubic',
    username: 'john99',
    email: 'john@gmail.com',
    password: '********',
    profilePic: '',
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />

        {/* Search & Add */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
            >
              Search
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-md"
            style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
            onClick={() => setShowModal(true)}
          >
            Add <FaPlus />
          </button>
        </div>

        {/* Table */}
        <div className="mt-8 rounded-xl border border-orange-200 overflow-x-auto">
          <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-[#F67F00] text-white text-lg border-b border-[#BD2D01]">
                <tr>
                  <th className="p-3 w-[120px] border-r border-[#BD2D01]"> </th>
                  <th className="p-3 w-[160px] border-r border-[#BD2D01]">First Name</th>
                  <th className="p-3 w-[160px] border-r border-[#BD2D01]">Last Name</th>
                  <th className="p-3 w-[180px] border-r border-[#BD2D01]">Username</th>
                  <th className="p-3 w-[220px] border-r border-[#BD2D01]">Email</th>
                  <th className="p-3 w-[130px] border-r border-[#BD2D01]">Password</th>
                  <th className="p-3 w-[90px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition"
                  >
                    <td className="p-3 w-[120px] text-center border-r border-[#BD2D01]">
                      <FaUserCircle className="text-2xl text-[#BD2D01]" />
                    </td>
                    <td className="p-3 w-[160px] border-r border-[#BD2D01]">{staff.firstName}</td>
                    <td className="p-3 w-[160px] border-r border-[#BD2D01]">{staff.lastName}</td>
                    <td className="p-3 w-[180px] border-r border-[#BD2D01]">{staff.username}</td>
                    <td className="p-3 w-[220px] border-r border-[#BD2D01]">{staff.email}</td>
                    <td className="p-3 w-[130px] border-r border-[#BD2D01]">{staff.password}</td>
                    <td className="p-3 w-[90px]">
                      <div className="flex justify-center gap-3 text-[#BD2D01]">
                        <FaEdit
                          className="cursor-pointer text-[#2C44BB]"
                          onClick={() => setEditingStaff(staff)}
                        />
                        <FaTrash
                          className="cursor-pointer text-[#BD1111]"
                          onClick={() => setDeletingStaff(staff)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showModal && <AddStaffModal onClose={() => setShowModal(false)} />}
        {editingStaff && (
          <EditStaffModal
            staff={editingStaff}
            onClose={() => setEditingStaff(null)}
            onUpdate={(updatedStaff) => {
              console.log('Updated:', updatedStaff);
              setEditingStaff(null);
            }}
          />
        )}
        {deletingStaff && (
          <DeleteStaffModal
            staff={deletingStaff}
            onClose={() => setDeletingStaff(null)}
            onConfirm={(staffToDelete) => {
              console.log('Deleted:', staffToDelete);
              setDeletingStaff(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
