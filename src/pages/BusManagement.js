import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddBusModal from '../components/AddBusModal';
import EditBusModal from '../components/EditBusModal';
import DeleteBusModal from '../components/DeleteBusModal';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const BusManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deletingBus, setDeletingBus] = useState(null);

  const buses = Array(12).fill({
    routeNo: '05',
    vehicleNo: 'WP 53-8909',
    busType: 'Non A/C',
    driverName: 'Saman Kumara',
    driverPhone: '071 688 9090',
    conductorName: 'Roony Parker',
    conductorPhone: '071 688 9090',
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
              <thead 
                className="bg-[#F67F00] text-white text-lg"
                style={{ position: 'sticky', top: 0, zIndex: 10 }}
              >
                <tr>
                  <th className="p-3 w-[110px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Route No</th>
					        <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Vehicle No</th>
					        <th className="p-3 w-[140px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Bus Type</th>
					        <th className="p-3 w-[180px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Driver Name</th>
					        <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Driver's Phone</th>
					        <th className="p-3 w-[180px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Conductor Name</th>
					        <th className="p-3 w-[160px] border-r" style={{ borderColor: 'rgba(189, 45, 1, 0.6)' }}>Conductor's Phone</th>
					        <th className="p-3 w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition"
                  >
                    <td className="p-3 w-[110px] border-r">{bus.routeNo}</td>
                    <td className="p-3 w-[160px] border-r">{bus.vehicleNo}</td>
                    <td className="p-3 w-[140px] border-r">{bus.busType}</td>
                    <td className="p-3 w-[180px] border-r">{bus.driverName}</td>
                    <td className="p-3 w-[160px] border-r">{bus.driverPhone}</td>
                    <td className="p-3 w-[180px] border-r">{bus.conductorName}</td>
                    <td className="p-3 w-[160px] border-r">{bus.conductorPhone}</td>
                    <td className="p-3 w-[100px] text-center">
                      <div className="flex justify-center gap-3 text-[#BD2D01]">
                        <FaEdit
                          className="cursor-pointer text-[#2C44BB]"
                          onClick={() => setEditingBus(bus)}
                        />
                        <FaTrash
                          className="cursor-pointer text-[#BD1111]"
                          onClick={() => setDeletingBus(bus)}
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
        {showModal && <AddBusModal onClose={() => setShowModal(false)} />}
        {editingBus && (
          <EditBusModal
            bus={editingBus}
            onClose={() => setEditingBus(null)}
            onUpdate={(updated) => {
              console.log('Updated bus:', updated);
              setEditingBus(null);
            }}
          />
        )}
        {deletingBus && (
          <DeleteBusModal
            user={deletingBus}
            onClose={() => setDeletingBus(null)}
            onConfirm={(toDelete) => {
              console.log('Deleted bus:', toDelete);
              setDeletingBus(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BusManagement;
