import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditDonorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bloodType: "",
    location: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const token = localStorage.getItem("token");

  // Check admin
  useEffect(() => {
    if (!token) {
      alert("You must be logged in as admin.");
      navigate("/login");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "admin") {
      alert("You are not authorized to edit donors.");
      navigate("/donors");
    } else {
      setIsAdmin(true);
    }
  }, [token, navigate]);

  // Fetch donor data
  useEffect(() => {
    if (!isAdmin) return;

    const fetchDonor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/donors/${id}`);
        if (!response.ok) throw new Error("Failed to fetch donor");
        const data = await response.json();
        setFormData({
          name: data.name,
          bloodType: data.bloodType,
          location: data.location,
          contact: data.contact,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, [id, isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/donors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update donor");
      }

      navigate("/donors");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold">
        Loading donor data...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center py-10 px-6">
      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Edit Donor</h1>

        {error && (
          <p className="text-red-700 font-semibold mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Blood Type</label>
            <input
              type="text"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="e.g., A+, O-, B+"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              placeholder="Phone number or email"
            />
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-red-700 text-white p-3 rounded-lg font-semibold shadow hover:bg-red-800 transition"
          >
            {submitLoading ? "Updating..." : "Update Donor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDonorPage;
