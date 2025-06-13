import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AddRouteModal from '../components/AddRouteModal.js';
import RouteDetailsModal from '../components/RouteDetailsModal';
import { FaPlus, FaChevronRight } from 'react-icons/fa';

const RouteManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const routes = Array(20).fill({
    routeNo: '05',
    routeName: 'Kurunegala - Colombo',
    vehicleNo: 'WP 52 - 9089',
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
            onClick={() => setShowAddModal(true)}
          >
            Add <FaPlus />
          </button>
        </div>

        {/* Route Table-Like Container */}
        <div className="mt-8 rounded-xl overflow-hidden border border-orange-200">
          {/* Fixed Header */}
          <div className="bg-[#F67F00] text-white font-semibold text-lg px-6 py-3 sticky top-0 z-10">
            
          </div>

          {/* Scrollable Data */}
          <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
            {routes.map((route, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-6 py-4 ${
                  index !== 0 ? 'border-t' : ''
                } border-orange-200 bg-orange-100 hover:bg-orange-200 transition`}
              >
                <div>
                  <p className="text-[#BD2D01]">
                    <span className="text-black font-bold">Route No:</span> {route.routeNo}
                  </p>
                  <p className="text-[#BD2D01]">
                    <span className="text-black font-bold">Route Name:</span> {route.routeName}
                  </p>
                  <p className="text-[#BD2D01]">
                    <span className="text-black font-bold">Vehicle No:</span> {route.vehicleNo}
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
        {selectedRoute && (
          <RouteDetailsModal
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RouteManagement;
