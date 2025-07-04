import React, { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Autocomplete, LoadScript } from '@react-google-maps/api'; // Import LoadScript and Autocomplete
import DeleteStopModal from './DeleteStopModal';
import api from '../services/api'; // Import the API instance to make requests

const AddStopModal = ({ onClose }) => {
  const [stopInput, setStopInput] = useState('');
  const [stops, setStops] = useState([]); // State to hold bus stops
  const [selectedStop, setSelectedStop] = useState(null); // Store selected bus stop
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stopToDeleteIndex, setStopToDeleteIndex] = useState(null);
  const [stopToDeleteName, setStopToDeleteName] = useState(null); // Store stop name for deletion
  const autocompleteRef = useRef(null); // Reference to the Autocomplete input field

  // Fetch all bus stops from the API when the modal opens
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await api.get('/busstop'); // Fetch bus stops from API
        setStops(response.data); // Set the bus stops data to state
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      }
    };
    fetchStops();
  }, []); // Empty dependency array to run only once when the modal is shown

  const handleAdd = async () => {
    if (selectedStop) {
      const { stopName, stopLatitude, stopLongitude } = selectedStop;

      // Send the new bus stop data to the backend API
      try {
        await api.post('/busstop', {
          StopName: stopName,
          StopLatitude: stopLatitude,
          StopLongitude: stopLongitude,
        });
        setStops([...stops, selectedStop]); // Add the new stop to the list
        setStopInput(''); // Clear the input field
        setSelectedStop(null); // Reset selected stop
      } catch (error) {
        console.error('Error adding bus stop:', error);
      }
    }
  };

  const requestDelete = (index, stopName) => {
    setStopToDeleteIndex(index);
    setStopToDeleteName(stopName); // Store stop name for deletion
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (stopToDeleteName) {
      try {
        // Send DELETE request to remove the bus stop from the backend
        await api.delete(`/busstop/${stopToDeleteName}`);
        // Update the frontend by removing the stop from the list
        const updatedStops = stops.filter((stop) => stop.stopName !== stopToDeleteName);
        setStops(updatedStops);
        setShowDeleteModal(false);
        setStopToDeleteIndex(null);
        setStopToDeleteName(null); // Clear state after delete
      } catch (error) {
        console.error('Error deleting bus stop:', error);
      }
    }
  };

  // Handle change in the input field and get predictions
  const handleInputChange = async (e) => {
    setStopInput(e.target.value);

    if (e.target.value) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: e.target.value, componentRestrictions: { country: 'LK' } }, // Add country restriction (if needed)
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // No need for separate suggestions list; Autocomplete handles this.
          }
        }
      );
    }
  };

  // Handle when a suggestion is selected
  const handleSelectSuggestion = (place) => {
    setStopInput(place.description); // Set the input field with the selected place
    setSelectedStop(null); // Reset selected stop before using place info

    // Get the place details (latitude, longitude)
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: place.description }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        setSelectedStop({
          stopName: place.description,
          stopLatitude: lat(),
          stopLongitude: lng(),
        });
      }
    });
  };

  return (
    <LoadScript 
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={['places']} // Make sure to load the 'places' library
    >
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div
          className="w-full max-w-2xl p-6 rounded-2xl shadow-xl relative"
          style={{
            background: 'linear-gradient(to bottom, #FB9933 0%, #CF4602 50%, #FB9933 100%)',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-white text-xl font-bold"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-white text-xl font-bold mb-6 text-left">Add Bus Stops</h2>

          {/* Input with Autocomplete */}
          <div className="flex gap-4 mb-4">
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={() => handleSelectSuggestion(autocompleteRef.current.getPlace())}
            >
              <input
                type="text"
                placeholder="Add New Bus Stop"
                value={stopInput}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 rounded-md bg-orange-100 placeholder-[#BD2D01] text-black focus:outline-none"
              />
            </Autocomplete>

            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-[#BD2D01] hover:bg-[#A53000] text-white font-semibold rounded-md"
            >
              Add
            </button>
          </div>

          {/* Stop List */}
          <div className="bg-[#F67F00] rounded-t-md text-white font-bold px-4 py-2">
            Bus Stop List
          </div>
          <div className="bg-orange-100 max-h-64 overflow-y-auto rounded-b-md">
            {/* Displaying fetched bus stops */}
            {stops.length === 0 ? (
              <p className="text-center text-gray-500">No bus stops available</p>
            ) : (
              stops.map((stop, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 border-b border-orange-300 hover:bg-orange-200 transition"
                >
                  <span>{stop.stopName}</span> {/* Display only the StopName */}
                  <FaTrash
                    onClick={() => requestDelete(index, stop.stopName)} // Pass stopName to the delete request
                    className="text-red-700 cursor-pointer hover:text-red-900"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteStopModal
            stopName={stopToDeleteName} // Pass the stop name to the DeleteStopModal
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete} // Call confirmDelete on confirmation
          />
        )}
      </div>
    </LoadScript>
  );
};

export default AddStopModal;
