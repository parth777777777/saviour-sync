import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaTint,
  FaHeartbeat,
  FaPhone,
  FaHospital,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";
import Select from "../../components/Select";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

// --- Custom Location Input ---
const CustomLocationInput = ({ value, onSelect, placeholder }) => {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
    defaultValue: value || "",
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ address, lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder={placeholder}
        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
      />
      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      {status === "OK" && data.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-xl mt-1 max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="p-3 cursor-pointer hover:bg-red-100"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- Search Page ---
const SearchPage = () => {
  const locationHook = useLocation();
  const [locationValue, setLocationValue] = useState("");
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("blood");
  const [value, setValue] = useState("");
  const [filterType, setFilterType] = useState("both");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedIds, setExpandedIds] = useState([]); // track expanded cards
  const [notifyMessage, setNotifyMessage] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const organs = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"];

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const urlType = params.get("type");
    const urlValue = params.get("value");
    const urlLocation = params.get("location");

    if (lat && lng) setCoords([parseFloat(lng), parseFloat(lat)]);
    if (urlType) setType(urlType);
    if (urlValue) setValue(urlValue);
    if (urlLocation) setLocationValue(urlLocation);
  }, [locationHook.search]);

  const fetchResults = async () => {
    if (!coords || !value || !type || !locationValue) return;
    setLoading(true);
    setError("");

    try {
      const url = new URL("http://localhost:5000/api/search");
      url.searchParams.append("lat", coords[1]);
      url.searchParams.append("lng", coords[0]);
      url.searchParams.append("type", type);
      url.searchParams.append("value", value);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch results");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNotify = (name) => {
    setNotifyMessage(`Notified ${name}!`);
    setTimeout(() => setNotifyMessage(""), 3000);
  };

  const getCardStyle = (item) => {
    if (item.type === "hospital") return "border-green-300 bg-green-50";
    if (item.type === "bloodbank") return "border-red-300 bg-red-50";
    if (item.type === "donor") return "border-blue-300 bg-blue-50";
    return "";
  };

  const renderInventoryGrid = (inventory, isBlood = true) => {
    if (!inventory) return null;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {Object.entries(inventory).map(([key, val]) => (
          <div
            key={key}
            className={`rounded-xl p-3 text-center shadow-sm ${
              isBlood ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            <p className="font-bold">{key}</p>
            <p className="text-lg">{val}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderCard = (item) => {
    const isExpanded = expandedIds.includes(item._id || item.id);
    return (
      <motion.div
        key={item._id || item.id || item.name}
        layout
        className={`rounded-xl shadow-sm p-5 border-l-8 ${getCardStyle(
          item
        )} flex flex-col gap-3 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer bg-white`}
        onClick={() => toggleExpand(item._id || item.id)}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {item.type === "hospital" && (
              <FaHospital className="text-green-500 text-2xl" />
            )}
            {item.type === "bloodbank" && (
              <FaTint className="text-red-500 text-2xl" />
            )}
            {item.type === "donor" && (
              <FaHeartbeat className="text-blue-500 text-2xl" />
            )}
            <span className="font-semibold text-lg capitalize">
              {item.type}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {item.distance && (
              <div className="text-gray-500 font-medium text-sm">
                {(item.distance / 1000).toFixed(1)} km
              </div>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400"
            >
              <FaChevronDown />
            </motion.div>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold truncate text-gray-800">
          {item.name || "Unnamed"}
        </h3>

        {/* Info */}
        <div className="flex flex-col gap-1 text-gray-600 text-sm">
          {item.location && (
            <a
              href={
                item.lat && item.lng
                  ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      item.location
                    )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 underline hover:text-red-500"
            >
              <FaMapMarkerAlt /> {item.location}
            </a>
          )}
        </div>

        {/* Expanded Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-gray-700 text-sm flex flex-col gap-2"
            >
              {item.type === "donor" && (
                <>
                  {item.age && <div>Age: {item.age}</div>}
                  {item.weight && <div>Weight: {item.weight} kg</div>}
                  {item.medicalConditions && (
                    <div>Medical Conditions: {item.medicalConditions}</div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotify(item.name || "Donor");
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-blue-600 transition"
                  >
                    <FaBell /> Notify
                  </button>
                </>
              )}
              {item.type === "bloodbank" &&
                renderInventoryGrid(item.bloodInventory, true)}
              {item.type === "hospital" && (
                <>
                  <h4 className="font-semibold text-gray-800 mt-2">
                    Blood Inventory
                  </h4>
                  {renderInventoryGrid(item.bloodInventory, true)}
                  <h4 className="font-semibold text-gray-800 mt-4">
                    Organ Inventory
                  </h4>
                  {renderInventoryGrid(item.organInventory, false)}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 pt-36"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification Alert */}
      <AnimatePresence>
        {notifyMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            {notifyMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-6 text-red-700"
      >
        Search Donors, Blood Banks & Hospitals
      </motion.h2>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className={`${
          results.length > 0
            ? "max-w-6xl mx-auto bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center sticky top-0 z-40"
            : "max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
        }`}
      >
        <div className="flex-1 w-full">
          <CustomLocationInput
            value={locationValue}
            onSelect={({ address, lat, lng }) => {
              setLocationValue(address);
              setCoords([lng, lat]);
            }}
            placeholder="Enter your city or location"
          />
        </div>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setValue("");
          }}
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <option value="blood">Blood</option>
          <option value="organ">Organ</option>
        </select>

        <Select
          options={type === "blood" ? bloodGroups : organs}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          type="submit"
          className="bg-red-400 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-500 transition"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {loading && (
        <p className="text-red-400 text-center animate-pulse mt-6">
          Loading results...
        </p>
      )}
      {error && <p className="text-red-400 text-center mt-6">{error}</p>}

      {results.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results
            .filter((item) => filterType === "both" || filterType === item.type)
            .map((item) => renderCard(item))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;
