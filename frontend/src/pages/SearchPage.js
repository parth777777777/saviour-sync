import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select"; // adjust path if needed

const SearchPage = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location || !type || !value) {
      alert("Please fill all fields");
      return;
    }

    // Redirect to DonorListPage with query parameters
    navigate(`/donors?location=${location}&type=${type}&value=${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Search for Donors
      </h2>

      <form
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Location Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        {/* Type Select */}
        <Select
          label="Type"
          options={["blood", "organ"]}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setValue(""); // reset value when type changes
          }}
        />

        {/* Value Select (Blood Group or Organ) */}
        {type && (
          <Select
            label={type === "blood" ? "Blood Group" : "Organ"}
            options={
              type === "blood"
                ? ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
                : ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"]
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchPage;