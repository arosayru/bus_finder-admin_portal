import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';

const UserManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const users = Array(12).fill({
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

        {/* Table Container */}
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
                  <th className="p-3 w-[180px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Username</th>
                  <th className="p-3 w-[220px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Email</th>
                  <th className="p-3 w-[130px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Password</th>
                  <th className="p-3 w-[90px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t"
                    style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}
                  >
                    <td className="p-3 w-[120px] text-center border-r">
                      <FaUserCircle className="text-2xl text-[#BD2D01]" />
                    </td>
                    <td className="p-3 w-[160px] border-r">{user.firstName}</td>
                    <td className="p-3 w-[160px] border-r">{user.lastName}</td>
                    <td className="p-3 w-[180px] border-r" >{user.username}</td>
                    <td className="p-3 w-[220px] border-r">{user.email}</td>
                    <td className="p-3 w-[130px] border-r">{user.password}</td>
                    <td className="p-3 w-[90px]">
                      <div className="flex justify-center gap-3 text-[#BD2D01]">
                        <FaEdit
                          className="cursor-pointer text-[#2C44BB]"
                          onClick={() => setEditingUser(user)}
                        />
                        <FaTrash
                          className="cursor-pointer text-[#BD1111]"
                          onClick={() => setDeletingUser(user)}
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
        {showModal && <AddUserModal onClose={() => setShowModal(false)} />}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUpdate={(updatedUser) => {
              console.log('Updated:', updatedUser);
              setEditingUser(null);
            }}
          />
        )}
        {deletingUser && (
          <DeleteUserModal
            user={deletingUser}
            onClose={() => setDeletingUser(null)}
            onConfirm={(userToDelete) => {
              console.log('Deleted:', userToDelete);
              setDeletingUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;
