import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddBusModal from '../components/AddBusModal';
import EditBusModal from '../components/EditBusModal';
import DeleteBusModal from '../components/DeleteBusModal';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import api from '../services/api';

const BusManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deletingBus, setDeletingBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Fetch buses and staff on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, staffRes] = await Promise.all([
          api.get('/bus'),
          api.get('/staff'),
        ]);

        const busesData = busRes.data || [];
        const staffData = staffRes.data || [];

        const enriched = enrichBusData(busesData, staffData);
        setBuses(enriched);
        setStaffList(staffData);
      } catch (err) {
        console.error('Error loading buses or staff:', err);
      }
    };

    fetchData();
  }, []);

  // Helper to map staff details to bus
  const enrichBusData = (busesData, staffData) => {
    return busesData.map(bus => {
      const driver = staffData.find(s => String(s.staffId) === String(bus.driverId));
      const conductor = staffData.find(s => String(s.staffId) === String(bus.conductorId));

      return {
        ...bus,
        DriverName: driver ? `${driver.firstName} ${driver.lastName}` : 'N/A',
        DriverPhone: driver?.telNo || 'N/A',
        ConductorName: conductor ? `${conductor.firstName} ${conductor.lastName}` : 'N/A',
        ConductorPhone: conductor?.telNo || 'N/A',
      };
    });
  };

  // After adding new bus
  const handleBusAdded = (newBus) => {
    const enriched = enrichBusData([newBus], staffList)[0];
    setBuses(prev => [...prev, enriched]);
  };

  const handleBusUpdated = (updatedBus) => {
    const enriched = enrichBusData([updatedBus], staffList)[0];

    setBuses(prev =>
      prev.map(b =>
        b.numberPlate === updatedBus.NumberPlate || b.NumberPlate === updatedBus.NumberPlate
          ? enriched
          : b
      )
    );

    setEditingBus(null);
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
                  <th className="p-3 w-[110px] border-r">Route No</th>
                  <th className="p-3 w-[160px] border-r">Vehicle No</th>
                  <th className="p-3 w-[140px] border-r">Bus Type</th>
                  <th className="p-3 w-[180px] border-r">Driver Name</th>
                  <th className="p-3 w-[160px] border-r">Driver's Phone</th>
                  <th className="p-3 w-[180px] border-r">Conductor Name</th>
                  <th className="p-3 w-[160px] border-r">Conductor's Phone</th>
                  <th className="p-3 w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus, index) => (
                  <tr
                    key={index}
                    className="bg-orange-100 border-t border-[#BD2D01] hover:bg-orange-200 transition"
                  >
                    <td className="p-3 border-r">{bus.busRouteNumber}</td>
                    <td className="p-3 border-r">{bus.numberPlate}</td>
                    <td className="p-3 border-r">{bus.busType}</td>
                    <td className="p-3 border-r">{bus.DriverName || 'N/A'}</td>
                    <td className="p-3 border-r">{bus.DriverPhone || 'N/A'}</td>
                    <td className="p-3 border-r">{bus.ConductorName || 'N/A'}</td>
                    <td className="p-3 border-r">{bus.ConductorPhone || 'N/A'}</td>
                    <td className="p-3 text-center">
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
        {showModal && (
          <AddBusModal
            onClose={() => setShowModal(false)}
            onBusAdded={handleBusAdded}
          />
        )}
        {editingBus && (
          <EditBusModal
            bus={editingBus}
            onClose={() => setEditingBus(null)}
            onUpdate={handleBusUpdated}
          />
        )}
        {deletingBus && (
        <DeleteBusModal
          bus={deletingBus}
          onClose={() => setDeletingBus(null)}
          onConfirm={(deletedBus) => {
            setBuses(prev =>
              prev.filter(b =>
                b.numberPlate !== deletedBus.numberPlate &&
                b.vehicleNo !== deletedBus.numberPlate
              )
            );
            setDeletingBus(null);
          }}
        />
      )}
      </div>
    </div>
  );
};

export default BusManagement;
