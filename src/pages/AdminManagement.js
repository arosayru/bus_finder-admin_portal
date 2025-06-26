import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddAdminModal from '../components/AddAdminModal';
import EditAdminModal from '../components/EditAdminModal';
import DeleteAdminModal from '../components/DeleteAdminModal';
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';
import { fetchAdmins } from '../services/api'; // Import the API function

const AdminManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [admins, setAdmins] = useState([]); // Admin data state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);

  // Fetching admin details from API on component mount
  useEffect(() => {
    const getAdmins = async () => {
      try {
        const response = await fetchAdmins(); // Fetch data from backend
        setAdmins(response.data); // Set the fetched data into state
      } catch (err) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    getAdmins();
  }, []);

  // If loading or error, show respective messages
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
            onClick={() => setShowAddModal(true)}
          >
            Add <FaPlus />
          </button>
        </div>

        {/* Admin Table */}
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
                  <th className="p-3 w-[130px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Tel No</th>
                  <th className="p-3 w-[90px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={index} className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition">
                    <td className="p-3 w-[120px] text-center border-r">
                      <img src={admin.profilePicture || 'default-profile.png'} alt="Profile" className="w-8 h-8 rounded-full" />
                    </td>
                    <td className="p-3 w-[160px] border-r">{admin.firstName}</td>
                    <td className="p-3 w-[160px] border-r">{admin.lastName}</td>
                    <td className="p-3 w-[220px] border-r">{admin.email}</td>
                    <td className="p-3 w-[130px] border-r">{admin.telNo}</td>
                    <td className="p-3 w-[90px]">
                      <div className="flex justify-center gap-3 text-[#BD2D01]">
                        <FaEdit
                          className="cursor-pointer text-[#2C44BB]"
                          onClick={() => setEditingAdmin(admin)}
                        />
                        <FaTrash
                          className="cursor-pointer text-[#BD1111]"
                          onClick={() => setDeletingAdmin(admin)}
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
        {showAddModal && <AddAdminModal onClose={() => setShowAddModal(false)} />}
        {editingAdmin && (
          <EditAdminModal
            admin={editingAdmin}
            onClose={() => setEditingAdmin(null)}
            onUpdate={(updatedAdmin) => {
              console.log('Updated:', updatedAdmin);
              setEditingAdmin(null);
            }}
          />
        )}
        {deletingAdmin && (
          <DeleteAdminModal
            admin={deletingAdmin}
            onClose={() => setDeletingAdmin(null)}
            onConfirm={(adminToDelete) => {
              console.log('Deleted:', adminToDelete);
              setDeletingAdmin(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
