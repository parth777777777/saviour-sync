import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const ManageHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const fetchHospitals = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/manage-hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch hospitals");
      }
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) return alert("All fields are required");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/manage-hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, address, phone }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add hospital");
      }
      setName("");
      setAddress("");
      setPhone("");
      fetchHospitals();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/manage-hospitals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete hospital");
      }
      fetchHospitals();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen p-6 pt-24 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Hospitals</h1>

      {/* Add Hospital Form */}
      <form
        onSubmit={handleAddHospital}
        className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 max-w-xl mx-auto mb-6"
      >
        <input
          type="text"
          placeholder="Hospital Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Hospital
        </button>
      </form>

      {loading && <p className="text-center text-gray-600 animate-pulse">Loading hospitals...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Hospital Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 max-w-4xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hospitals.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">{h.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{h.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{h.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageHospitalsPage;
