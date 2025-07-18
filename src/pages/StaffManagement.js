import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddStaffModal from '../components/AddStaffModal';
import EditStaffModal from '../components/EditStaffModal';
import DeleteStaffModal from '../components/DeleteStaffModal';
import { FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';
import api from '../services/api';

const StaffManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deletingStaff, setDeletingStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      const staffData = response.data;

      const staffWithPics = await Promise.all(
        staffData.map(async (staff) => {
          if (staff.profilePicture) {
            return staff; // Use provided URL
          }

          try {
            const res = await api.get(`/staff/profile-picture/${staff.staffId}`, {
              responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(res.data);
            return { ...staff, profilePicture: imageUrl };
          } catch (err) {
            console.warn(`No profile picture found for ${staff.email}:`, err.message);
            return { ...staff, profilePicture: '' };
          }
        })
      );

      setStaffList(staffWithPics);
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddStaff = (newStaff) => {
    setStaffList((prevList) => [...prevList, newStaff]);
  };

  const handleUpdateStaff = (updatedStaff) => {
    setStaffList((prevList) =>
      prevList.map((staff) =>
        staff.staffId === updatedStaff.staffId ? { ...staff, ...updatedStaff } : staff
      )
    );
    setEditingStaff(null); // Close the modal after the update
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await api.delete(`/staff/${staffId}`);
      if (response.status === 200) {
        setStaffList((prevList) => prevList.filter((staff) => staff.staffId !== staffId));
      }
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
              disabled
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
              <thead
                className="bg-[#F67F00] text-white text-lg"
                style={{ position: 'sticky', top: 0, zIndex: 10 }}
              >
                <tr>
                  <th className="p-3 w-[120px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}></th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>First Name</th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Last Name</th>
                  <th className="p-3 w-[220px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Email</th>
                  <th className="p-3 w-[180px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>NIC</th>
                  <th className="p-3 w-[130px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Tel No</th>
                  <th className="p-3 w-[150px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Staff Role</th>
                  <th className="p-3 w-[90px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition"
                  >
                    <td className="p-3 w-[120px] text-center border-r">
                      {staff.profilePicture && typeof staff.profilePicture === 'string' && staff.profilePicture.startsWith('http') ? (
                        <img
                          src={staff.profilePicture}
                          alt="Staff"
                          className="w-10 h-10 rounded-full object-cover mx-auto"
                        />
                      ) : (                     
                        <FaUserCircle className="text-2xl text-[#BD2D01]" />
                      )}
                    </td>
                    <td className="p-3 w-[160px] border-r">{staff.firstName}</td>
                    <td className="p-3 w-[160px] border-r">{staff.lastName}</td>
                    <td className="p-3 w-[220px] border-r break-words">{staff.email}</td> {/* Added break-words */}
                    <td className="p-3 w-[180px] border-r">{staff.nic}</td>
                    <td className="p-3 w-[130px] border-r">{staff.telNo}</td>
                    <td className="p-3 w-[150px] border-r">{staff.staffRole}</td>
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
        {showModal && <AddStaffModal onClose={() => setShowModal(false)} onAddStaff={handleAddStaff} />}
        {editingStaff && (
          <EditStaffModal
            staff={editingStaff}
            onClose={() => setEditingStaff(null)}
            onUpdate={handleUpdateStaff}  // Pass the update handler
          />
        )}
        {deletingStaff && (
          <DeleteStaffModal
            staff={deletingStaff}
            onClose={() => setDeletingStaff(null)}
            onConfirm={(deletedStaff) => {
              setStaffList((prev) => prev.filter((s) => s.staffId !== deletedStaff.staffId));
              setDeletingStaff(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
