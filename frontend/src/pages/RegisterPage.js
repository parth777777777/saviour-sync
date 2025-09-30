import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select";
import LocationInput from "../components/LocationInput";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    locationCoords: { type: "Point", coordinates: [] },
    bloodGroup: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const email = localStorage.getItem("email");
      if (email) setFormData((prev) => ({ ...prev, email }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to register a donor");

      const response = await fetch("http://localhost:5000/api/donors", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to register donor");

      navigate("/search");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-4">
      {/* Title moved outside the card */}
      <h1 className="text-3xl font-bold text-red-700 text-center mb-8">
        Register as a Donor
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
        {error && (
          <p className="text-center text-red-700 font-semibold mb-6">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <LocationInput
              value={formData.location}
              onSelect={({ address, lat, lng }) =>
                setFormData({
                  ...formData,
                  location: address,
                  locationCoords: { type: "Point", coordinates: [lng, lat] },
                })
              }
            />
          </div>

          {/* Blood Group */}
          <Select
            label="Blood Group"
            options={bloodGroups}
            value={formData.bloodGroup}
            onChange={(e) =>
              setFormData({ ...formData, bloodGroup: e.target.value })
            }
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
