import React, { useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Dashboard = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load Google Maps script if not already loaded
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initLiveMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        window.initLiveMap();
      }
    };

    // Global callback to initialize the map
    window.initLiveMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 12,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // We'll add SignalR connection and live markers in the next step
      console.log("🗺️ Map initialized");
    };

    loadGoogleMaps();
  }, []);

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
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{
                background: 'linear-gradient(to bottom, #F67F00, #CF4602)',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-8">
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-xl shadow-inner"
            style={{ backgroundColor: '#e0e0e0' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
