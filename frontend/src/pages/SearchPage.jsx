import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTint, FaHeartbeat, FaPhone, FaHospital } from "react-icons/fa";
import Select from "../components/Select";
import LocationInput from "../components/LocationInput";

const SearchPage = () => {
  const locationHook = useLocation();
  const navigate = useNavigate();

  const [locationValue, setLocationValue] = useState("");
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("blood");
  const [value, setValue] = useState("");
  const [filterType, setFilterType] = useState("both");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const getCardStyle = (item) => {
    if (item.type === "hospital") return "border-green-300 bg-green-50";
    if (item.type === "bloodbank") return "border-red-300 bg-red-50";
    if (item.type === "donor") return "border-blue-300 bg-blue-50";
    return "";
  };

  const renderCard = (item) => (
    <div
      key={item.id || item.name}
      className={`rounded-xl shadow-md p-4 border-l-8 ${getCardStyle(item)} flex flex-col gap-3 hover:shadow-lg transition`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {item.type === "hospital" && <FaHospital className="text-green-400 text-2xl" />}
          {item.type === "bloodbank" && <FaTint className="text-red-400 text-2xl" />}
          {item.type === "donor" && <FaHeartbeat className="text-blue-400 text-2xl" />}
          <span className="font-semibold capitalize">{item.type}</span>
        </div>
        {item.distance && (
          <div className="text-gray-500 font-medium text-sm">{(item.distance / 1000).toFixed(1)} km</div>
        )}
      </div>

      <h3 className="text-xl font-bold truncate">{item.name}</h3>

      <div className="flex flex-wrap gap-3 items-center text-gray-600 text-sm">
        <div className="flex items-center gap-1"><FaMapMarkerAlt /> {item.location || "N/A"}</div>
        {item.type === "donor" && item.bloodGroup && <div className="flex items-center gap-1"><FaTint /> {item.bloodGroup}</div>}
        {item.type === "donor" && item.organ && <div className="flex items-center gap-1"><FaHeartbeat /> {item.organ}</div>}
        {item.type === "bloodbank" && item.bloodInventory && <div className="flex items-center gap-1"><FaTint /> Stock</div>}
      </div>

      {item.phone && (
        <a
          href={`tel:${item.phone}`}
          className="mt-2 bg-red-400 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-red-500 transition"
        >
          Call <FaPhone />
        </a>
      )}
    </div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 pt-36" // pt-36 pushes content below header
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title outside the card/form */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-6"
      >
        Search Donors, Blood Banks & Hospitals
      </motion.h2>

      <form
        onSubmit={handleSearchSubmit}
        className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <label className="font-semibold">Location</label>
          <LocationInput
            value={locationValue}
            onSelect={({ address, lat, lng }) => {
              setLocationValue(address);
              setCoords([lng, lat]);
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-semibold">Type</label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setValue(""); }}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="blood">Blood Group</option>
            <option value="organ">Organ</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <label className="font-semibold">Value</label>
          <Select
            options={type === "blood" ? bloodGroups : organs}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-red-400 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition"
        >
          Search
        </button>

        {loading && <p className="text-red-400 text-center animate-pulse">Loading results...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>

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
