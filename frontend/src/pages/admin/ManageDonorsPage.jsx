import React, { useEffect, useState } from "react";
import AdminHeaderLink from "../../components/AdminHeaderLink";
import { useNavigate } from "react-router-dom";

const ManageDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ bloodGroup: "", location: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/donors");
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/donors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Failed to delete donor");

      setDonors(donors.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredDonors = donors.filter(
    (d) =>
      (!filter.bloodGroup || d.bloodGroup === filter.bloodGroup) &&
      (!filter.location ||
        d.location.toLowerCase().includes(filter.location.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <AdminHeaderLink />
      <h1 className="text-3xl font-bold text-red-700 mb-6">Manage Donors</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Blood Group"
          value={filter.bloodGroup}
          onChange={(e) =>
            setFilter({ ...filter, bloodGroup: e.target.value.toUpperCase() })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by Location"
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading donors...</p>
      ) : filteredDonors.length === 0 ? (
        <p>No donors found.</p>
      ) : (
        <table className="w-full table-auto bg-white rounded-xl shadow">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Blood Group</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor) => (
              <tr key={donor._id} className="border-b">
                <td className="p-3">{donor.name}</td>
                <td className="p-3">{donor.email}</td>
                <td className="p-3">{donor.phone}</td>
                <td className="p-3">{donor.bloodGroup}</td>
                <td className="p-3">{donor.location}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit/${donor._id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(donor._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageDonorsPage;
