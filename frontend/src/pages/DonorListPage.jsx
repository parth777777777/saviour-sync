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
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold text-xl">
        Loading donors...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-700 font-semibold text-xl">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 mb-12 text-center tracking-tight">
        Donor Directory
      </h1>

      {/* Search Filters */}
      <div className="max-w-6xl mx-auto mb-10 grid md:grid-cols-3 gap-4">
        {["Name", "Blood Type", "Location"].map((placeholder, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Search by ${placeholder}`}
            className="p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow hover:shadow-lg transition placeholder-gray-400"
            value={
              idx === 0
                ? searchName
                : idx === 1
                ? searchBloodType
                : searchLocation
            }
            onChange={(e) =>
              idx === 0
                ? setSearchName(e.target.value)
                : idx === 1
                ? setSearchBloodType(e.target.value)
                : setSearchLocation(e.target.value)
            }
          />
        ))}
      </div>

      {/* Donor Cards */}
      {filteredDonors.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          No donors found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col justify-between border-l-8 border-red-500 transform hover:-translate-y-1 duration-300"
            >
              <div>
                <h2 className="text-2xl font-bold text-red-700 mb-2 tracking-tight">
                  {donor.name}
                </h2>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Blood Type:</span> {donor.bloodType}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Location:</span> {donor.location}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Contact:</span> {donor.contact}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => navigate(`/edit/${donor._id}`)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:from-red-700 hover:to-red-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-300 transition"
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
