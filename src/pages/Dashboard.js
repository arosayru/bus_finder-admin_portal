import React, { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../services/api';

const Dashboard = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const busMarkers = useRef({});

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const { data: config } = await api.get('/map/admin-view-all-bus');
        const { googleMapsApiKey, initialCameraPosition, mapOptions, layers } = config;

        const scriptId = 'google-maps-script';
        const existingScript = document.getElementById(scriptId);

        const initializeMapWithGoogle = () => {
          if (window.google?.maps) {
            initializeMap(initialCameraPosition, mapOptions, layers);
          } else {
            const interval = setInterval(() => {
              if (window.google?.maps) {
                clearInterval(interval);
                initializeMap(initialCameraPosition, mapOptions, layers);
              }
            }, 100);
          }
        };

        if (!existingScript) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          script.onload = initializeMapWithGoogle;
        } else {
          initializeMapWithGoogle();
        }
      } catch (err) {
        console.error('❌ Failed to load map configuration:', err);
      }
    };

    const initializeMap = (camera, options, layers) => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: camera.latitude, lng: camera.longitude },
        zoom: camera.zoom,
        mapTypeId: options.mapType || 'roadmap',
        zoomControl: options.zoomControlsEnabled,
        rotateControl: options.rotateGesturesEnabled,
        scaleControl: options.zoomGesturesEnabled,
        streetViewControl: false,
        fullscreenControl: true,
        styles: options.styles || [],
      });

      mapInstance.current = map;
      console.log('🗺️ Map initialized');

      const liveLayer = layers.find(layer => layer.id === 'liveBusLocationsLayer');
      if (liveLayer) {
        initializeSignalR(liveLayer);
      }
    };

    const initializeSignalR = (liveLayer) => {
      const hubUrl = `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${liveLayer.signalRHubUrl}`;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on('BusLocationUpdated', (busId, lat, lng) => {
        const map = mapInstance.current;
        const position = { lat, lng };

        if (busMarkers.current[busId]) {
          busMarkers.current[busId].setPosition(position);
        } else {
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: `Bus ${busId}`,
            icon: {
              url: liveLayer.renderOptions.markerIconUrl,
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>🚌 Bus ${busId}</strong><br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}</div>`,
          });

          marker.addListener('click', () => infoWindow.open(map, marker));
          busMarkers.current[busId] = marker;
        }
      });

      connection
        .start()
        .then(() => console.log('✅ SignalR connected'))
        .catch(err => console.error('❌ SignalR connection error:', err));
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
              autoComplete="off"
              className="px-4 py-2 w-80 rounded-l-md border border-[#BD2D01] bg-orange-50 placeholder-[#F67F00] text-[#F67F00] focus:outline-none"
            />
            <button
              className="px-4 py-2 rounded-r-md border border-[#BD2D01] text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom, #F67F00, #CF4602)' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Live Map Area */}
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
