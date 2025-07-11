import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddShiftModal from '../components/AddShiftModal';
import EditShiftModal from '../components/EditShiftModal';
import DeleteShiftModal from '../components/DeleteShiftModal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ShiftManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [deletingShift, setDeletingShift] = useState(null);

  const shifts = Array(12).fill({
    routeNo: 'No 5',
    routeName: 'Kurunagala - Colombo',
    departureTime: '9.15a.m',
    arrivalTime: '11.45p.m',
    date: '04/06/2025',
  });

  const handleAdd = (newShift) => {
    console.log('New Shift Added:', newShift);
    setShowAddModal(false);
    // In production: update your state to include the new shift
  };

  const handleUpdate = (updatedShift) => {
    console.log('Shift Updated:', updatedShift);
    setEditingShift(null);
    // In production: update your shift list state
  };

  const handleDelete = (shift) => {
    console.log('Shift deleted:', shift);
    setDeletingShift(null);
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

        {/* Shift Table */}
        <div className="mt-8 rounded-xl border border-orange-200 overflow-hidden">
          <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-[#F67F00] text-white text-lg sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-[120px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Route No</th>
                  <th className="p-3 w-[220px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Route Name</th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Departure Time</th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Arrival Time</th>
                  <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Date</th>
                  <th className="p-3 w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition"
                  >
                    <td className="p-3 w-[120px] border-r">{shift.routeNo}</td>
                    <td className="p-3 w-[220px] border-r">{shift.routeName}</td>
                    <td className="p-3 w-[160px] border-r">{shift.departureTime}</td>
                    <td className="p-3 w-[160px] border-r">{shift.arrivalTime}</td>
                    <td className="p-3 w-[160px] border-r">{shift.date}</td>
                    <td className="p-3 w-[100px]">
                      <div className="flex gap-3 justify-center text-[#BD2D01]">
                        <FaEdit
                          className="cursor-pointer text-[#2C44BB]"
                          onClick={() => setEditingShift(shift)}
                        />
                        <FaTrash
                          className="cursor-pointer text-[#BD1111]"
                          onClick={() => setDeletingShift(shift)}
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
        {showAddModal && (
          <AddShiftModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}

        {editingShift && (
          <EditShiftModal
            shift={editingShift}
            onClose={() => setEditingShift(null)}
            onUpdate={handleUpdate}
          />
        )}

        {deletingShift && (
          <DeleteShiftModal
            shift={deletingShift}
            onClose={() => setDeletingShift(null)}
            onConfirm={(toDelete) => {
              console.log('Deleted shift:', toDelete);
              setDeletingShift(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
