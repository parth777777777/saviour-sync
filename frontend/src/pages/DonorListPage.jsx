// src/pages/DonorListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DonorListPage = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBloodType, setSearchBloodType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsAdmin(payload.role === "admin");
    }
  }, [token]);

  const fetchDonors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/donors");
      if (!response.ok) throw new Error("Failed to fetch donors");
      const data = await response.json();
      setDonors(data);
      setFilteredDonors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    const filtered = donors.filter((donor) =>
      donor.name.toLowerCase().includes(searchName.toLowerCase()) &&
      donor.bloodType.toLowerCase().includes(searchBloodType.toLowerCase()) &&
      donor.location.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredDonors(filtered);
  }, [searchName, searchBloodType, searchLocation, donors]);

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Unauthorized");

    const confirm = window.confirm("Are you sure you want to delete this donor?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:5000/api/donors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete donor");
      fetchDonors();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold">
        Loading donors...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <h1 className="text-3xl font-bold text-red-700 mb-8 text-center">Donor List</h1>

      <div className="max-w-6xl mx-auto mb-8 grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Blood Type"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          value={searchBloodType}
          onChange={(e) => setSearchBloodType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {filteredDonors.length === 0 ? (
        <p className="text-center text-gray-600">No donors found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-2">{donor.name}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Blood Type:</span> {donor.bloodType}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Location:</span> {donor.location}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Contact:</span> {donor.contact}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/edit/${donor._id}`)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorListPage;
