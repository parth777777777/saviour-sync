import React, { useEffect, useState } from "react";
import AdminHeaderLink from "../../components/AdminHeaderLink";

const ManageBloodBanksPage = () => {
  const [bloodbanks, setBloodbanks] = useState([]);
  const [filter, setFilter] = useState({ bloodType: "", minQty: "" });

  const fetchBloodbanks = async () => {
    let query = [];
    if (filter.bloodType) query.push(`bloodType=${filter.bloodType}`);
    if (filter.minQty) query.push(`minQty=${filter.minQty}`);
    const res = await fetch(`http://localhost:5000/api/bloodbanks?${query.join("&")}`);
    const data = await res.json();
    setBloodbanks(data);
  };

  useEffect(() => {
    fetchBloodbanks();
  }, [filter]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <AdminHeaderLink />
      <h1 className="text-3xl font-bold text-red-700 mb-6">Manage Blood Banks</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Blood Type"
          value={filter.bloodType}
          onChange={(e) => setFilter({ ...filter, bloodType: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Quantity"
          value={filter.minQty}
          onChange={(e) => setFilter({ ...filter, minQty: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={fetchBloodbanks}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Apply
        </button>
      </div>

      {/* Table/List */}
      <div className="bg-white p-6 rounded-xl shadow">
        {bloodbanks.length === 0 ? (
          <p>No blood banks found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2">Blood Inventory</th>
              </tr>
            </thead>
            <tbody>
              {bloodbanks.map((b) => (
                <tr key={b.id || b.name} className="border-b">
                  <td className="py-2">{b.name}</td>
                  <td className="py-2">{b.location}</td>
                  <td className="py-2">
                    {b.bloodInventory
                      ? Object.entries(b.bloodInventory)
                          .map(([type, qty]) => `${type}: ${qty}`)
                          .join(", ")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBloodBanksPage;
