import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 px-6">
        <Topbar />

        {/* Page Title */}
        <div className="mt-6 flex justify-center">
          <h1 className="text-2xl font-bold text-[#BD2D01]">Monitor Buses</h1>
        </div>

        {/* Centered Search Bar */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-80 rounded-l-md border border-orange-300 bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md text-white font-semibold"
              style={{
                background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8">
          <div className="w-full h-[500px] bg-gray-200 rounded-xl shadow-inner flex items-center justify-center text-gray-600 text-xl font-semibold">
            Map Placeholder (Bus Tracking will show here)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
