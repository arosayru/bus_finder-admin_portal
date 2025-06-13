import React from 'react';

const DeleteRouteModal = ({ route, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div
        className="w-full max-w-sm p-6 rounded-xl text-center shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-3">Delete?</h2>
        <p className="text-white font-semibold mb-6">
          Are you sure delete <span className="text-white font-bold">“Route No {route.routeNo}”</span>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(route)}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-md font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRouteModal;
