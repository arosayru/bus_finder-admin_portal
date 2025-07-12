import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddRouteModal from '../components/AddRouteModal.js';
import AddStopModal from '../components/AddStopModal.js';
import EditRouteModal from '../components/EditRouteModal.js';
import DeleteRouteModal from '../components/DeleteRouteModal';
import RouteDetailsModal from '../components/RouteDetailsModal';
import { FaPlus, FaChevronRight } from 'react-icons/fa';
import api from '../services/api';

const RouteManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/busroute');
      setRoutes(res.data || []);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    }
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedRoute) => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) =>
        r.RouteId === updatedRoute.RouteId ? updatedRoute : r
      )
    );
    setShowEditModal(false);
    setSelectedRoute(null);
  };

  const handleDelete = (route) => {
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (route) => {
    try {
      await api.delete(`/busroute/${route.RouteId}`);
      setRoutes((prev) => prev.filter((r) => r.RouteId !== route.RouteId));
      setShowDeleteModal(false);
      setSelectedRoute(null);
    } catch (error) {
      console.error('Delete failed:', error);
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
              onClick={fetchRoutes}
            >
              Search
            </button>
          </div>

          {/* Add Buttons */}
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-md"
              style={{ background: 'linear-gradient(to top, #F67F00, #CF4602)' }}
              onClick={() => setShowAddStopModal(true)}
            >
              Add Bus Stops <FaPlus />
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-md"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
              onClick={() => setShowAddModal(true)}
            >
              Add Route <FaPlus />
            </button>
          </div>
        </div>

        {/* Route List */}
        <div className="mt-8 rounded-xl overflow-hidden border border-orange-200">
          <div className="bg-[#F67F00] text-white font-semibold text-lg px-6 py-3 sticky top-0 z-10">
            Bus Routes
          </div>

          <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
            {routes
              .filter((r) =>
                r.routeName.toLowerCase().includes(search.toLowerCase()) ||
                r.routeNumber.toLowerCase().includes(search.toLowerCase())
              )
              .map((route, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-6 py-4 ${
                    index !== 0 ? 'border-t' : ''
                  } border-orange-200 bg-orange-100 hover:bg-orange-200 transition`}
                >
                  <div>
                    <p className="text-[#BD2D01]">
                      <span className="text-black font-bold">Route No:</span> {route.routeNumber}
                    </p>
                    <p className="text-[#BD2D01]">
                      <span className="text-black font-bold">Route Name:</span> {route.routeName}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRoute(route)}
                    className="text-[#BD2D01] text-xl hover:scale-110 transition"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Modals */}
        {showAddModal && <AddRouteModal onClose={() => setShowAddModal(false)} />}
        {showAddStopModal && <AddStopModal onClose={() => setShowAddStopModal(false)} />}
        {selectedRoute && !showEditModal && (
          <RouteDetailsModal
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {showEditModal && selectedRoute && (
          <EditRouteModal
            route={selectedRoute}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRoute(null);
            }}
            onUpdate={handleUpdate}
          />
        )}
        {showDeleteModal && routeToDelete && (
          <DeleteRouteModal
            route={routeToDelete}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default RouteManagement;
