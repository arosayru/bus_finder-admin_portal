import React from 'react';

const RouteDetailsModal = ({ route, onClose, onEdit, onDelete }) => {
  const {
    routeNo,
    routeName,
    routePlaces = [
      'Kurunegala',
      'Polgahawela',
      'Alawwa',
      'Warakapola',
      'Nittambuwa',
      'Yakkala',
      'Kadawatha',
      'Peliyagoda',
      'Colombo',
    ],
    vehicleNo = '58 - 89439',
    driverName = 'Saman Kumara',
    conductorName = 'Ruby Parker',
    phone = '073 900 9393',
  } = route;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div
        className="w-full max-w-lg rounded-2xl shadow-xl relative p-6"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-white text-xl font-bold mb-6 text-center">View Route Details</h2>

        {/* Route Info */}
        <div className="text-black space-y-2 font-medium">
          <p>
            <span className="font-bold">Route No:</span> {routeNo}
          </p>
          <p>
            <span className="font-bold">Route Name:</span> {routeName}
          </p>
          <p>
            <span className="font-bold">Route:</span>
            <ul className="ml-6 list-disc text-black mt-1">
              {routePlaces.map((place, idx) => (
                <li key={idx}>{place}</li>
              ))}
            </ul>
          </p>
          <p>
            <span className="font-bold">Vehicle No:</span> {vehicleNo}
          </p>
          <p>
            <span className="font-bold">Driver’s Name:</span> {driverName}
          </p>
          <p>
            <span className="font-bold">Conductor’s Name:</span> {conductorName}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {phone}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => onDelete(route)}
            className="bg-[#BD1111] hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Delete
          </button>
          <button
            onClick={() => onEdit(route)}
            className="bg-[#2C44BB] hover:bg-blue-800 text-white px-6 py-2 rounded-md font-semibold"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsModal;
