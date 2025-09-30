import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Select from "../components/Select";
import LocationInput from "../components/LocationInput";
import { ResultCard, DetailModal } from "../components/CardMotion";

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // 🔹 new state

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const organs = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"];

  // Fetch query params from URL
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

    // If query params exist → already searched
    if (urlValue || urlLocation) setHasSearched(true);
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
    setHasSearched(true); // 🔹 switch to horizontal after first search
    fetchResults();

    const searchParams = new URLSearchParams({
      lat: coords?.[1] || "",
      lng: coords?.[0] || "",
      type,
      value,
      location: locationValue,
    });
    navigate(
      { pathname: "/search", search: searchParams.toString() },
      { replace: true }
    );
  };

  const getCardClass = (item) => {
    if (item.type === "bloodbank") return "border-blue-500 bg-blue-50";
    if (item.type === "hospital") return "border-green-500 bg-green-50";
    if (item.type === "donor") return "border-red-500 bg-gray-50";
    return "";
  };

  const renderLocationLink = (location) =>
    location ? (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {location}
      </a>
    ) : (
      "N/A"
    );

  const renderCardContent = (item) => (
    <div className="text-center space-y-1">
      <h3
        className={`text-xl font-bold ${
          item.type === "bloodbank"
            ? "text-blue-600"
            : item.type === "hospital"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {item.name}{" "}
        {item.type === "bloodbank"
          ? "(Blood Bank)"
          : item.type === "hospital"
          ? "(Hospital)"
          : "(Donor)"}
      </h3>

      {item.type === "donor" && (
        <>
          {item.bloodGroup && (
            <p>
              <span className="font-semibold">Blood:</span> {item.bloodGroup}
            </p>
          )}
          {item.organ && (
            <p>
              <span className="font-semibold">Organ:</span> {item.organ}
            </p>
          )}
          <p>
            <span className="font-semibold">Contact:</span>{" "}
            {item.phone || item.email || "N/A"}
          </p>
        </>
      )}

      {item.type === "bloodbank" && item.bloodInventory && (
        <p className="truncate">
          <span className="font-semibold">Stock:</span>{" "}
          {Object.entries(item.bloodInventory)
            .filter(([_, qty]) => qty > 0)
            .map(([bg, qty]) => `${bg}: ${qty}L`)
            .join(", ")}
        </p>
      )}

      {item.type === "hospital" && (
        <p>
          <span className="font-semibold">Services:</span> Blood Bank & Organ
          Transplant
        </p>
      )}

      <p>
        <span className="font-semibold">Location:</span>{" "}
        {renderLocationLink(item.location)}
      </p>

      {item.distance !== undefined && (
        <p>
          <span className="font-semibold">Dist:</span>{" "}
          {(item.distance / 1000).toFixed(1)} km
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-red-100 to-white py-10 px-4 relative">
      <h2 className="text-4xl font-extrabold text-red-700 text-center mb-10">
        Search Donors, Blood Banks & Hospitals
      </h2>

      {/* 🔹 Switch layout based on hasSearched */}
      <form
        onSubmit={handleSearchSubmit}
        className={`gap-4 mb-10 bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto 
        ${hasSearched ? "flex flex-row items-end" : "flex flex-col"}`}
      >
        {/* Location Input */}
        <div className="flex-1 flex flex-col">
          {!hasSearched && (
            <label className="block text-gray-700 font-medium mb-2">Location</label>
          )}
          <LocationInput
            value={locationValue}
            onSelect={({ address, lat, lng }) => {
              setLocationValue(address);
              setCoords([lng, lat]);
            }}
            className="h-12"
          />
        </div>

        {/* Type */}
        <div className="flex-1 flex flex-col">
          {!hasSearched && (
            <label className="block text-gray-700 font-medium mb-2">Type</label>
          )}
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setValue("");
            }}
            className="w-full p-3 h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="blood">Blood Group</option>
            <option value="organ">Organ</option>
          </select>
        </div>

        {/* Value */}
        <div className="flex-1 flex flex-col">
          {!hasSearched && (
            <label className="block text-gray-700 font-medium mb-2">Value</label>
          )}
          <Select
            label=""
            options={type === "blood" ? bloodGroups : organs}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Filter */}
        {!hasSearched && (
          <div className="flex-1 flex flex-col">
            <label className="block text-gray-700 font-medium mb-2">Show</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="both">All</option>
              <option value="donor">Donors Only</option>
              <option value="bloodbank">Blood Banks Only</option>
              <option value="hospital">Hospitals Only</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-red-700 transition h-12"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center text-red-700 font-semibold mb-4 animate-pulse">
          Loading results...
        </div>
      )}
      {error && (
        <div className="text-center text-red-700 font-semibold mb-4">{error}</div>
      )}
      {results.length === 0 && !loading && !error && hasSearched && (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      {/* Results */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {results
          .filter((item) => filterType === "both" || filterType === item.type)
          .map((item, idx) => (
            <ResultCard
              key={idx}
              item={{ ...item, children: renderCardContent(item) }}
              onClick={() => setSelectedItem(item)}
              className={`border-t-4 ${getCardClass(item)}`}
            />
          ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={{ ...selectedItem, children: renderCardContent(selectedItem) }}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;
