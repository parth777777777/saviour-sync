import React, { useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const CustomLocationInput = ({ value, onSelect }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const autocompleteService = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY",
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }

    if (e.target.value.length > 2) {
      autocompleteService.current.getPlacePredictions(
        { input: e.target.value },
        (preds) => {
          setPredictions(preds || []);
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = async (place) => {
    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise((resolve) => {
      geocoder.geocode({ placeId: place.place_id }, (res) => resolve(res));
    });

    if (result && result[0]) {
      const location = result[0].geometry.location;
      onSelect({
        address: result[0].formatted_address,
        lat: location.lat(),
        lng: location.lng(),
      });
      setInputValue(result[0].formatted_address);
      setPredictions([]);
    }
  };

  return (
    <div className="relative">
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter your location"
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
      />
      {predictions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onClick={() => handleSelect(p)}
              className="p-3 hover:bg-red-100 cursor-pointer"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomLocationInput;
