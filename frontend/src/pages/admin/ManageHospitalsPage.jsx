import React, { useEffect, useState } from "react";
import AdminHeaderLink from "../../components/AdminHeaderLink";

const ManageHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState({ bloodType: "", minBloodQty: "", organType: "", minOrganQty: "" });

  const fetchHospitals = async () => {
    let query = [];
    if (filter.bloodType) query.push(`bloodType=${filter.bloodType}`);
    if (filter.minBloodQty) query.push(`minBloodQty=${filter.minBloodQty}`);
    if (filter.organType) query.push(`organType=${filter.organType}`);
    if (filter.minOrganQty) query.push(`minOrganQty=${filter.minOrganQty}`);
    const res = await fetch(`http://localhost:5000/api/hospitals?${query.join("&")}`);
    const data = await res.json();
    setHospitals(data);
  };

  useEffect(() => {
    fetchHospitals();
  }, [filter]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <AdminHeaderLink />
      <h1 className="text-3xl font-bold text-red-700 mb-6">Manage Hospitals</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Blood Type"
          value={filter.bloodType}
          onChange={(e) => setFilter({ ...filter, bloodType: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Blood Qty"
          value={filter.minBloodQty}
          onChange={(e) => setFilter({ ...filter, minBloodQty: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Organ Type"
          value={filter.organType}
          onChange={(e) => setFilter({ ...filter, organType: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Organ Qty"
          value={filter.minOrganQty}
          onChange={(e) => setFilter({ ...filter, minOrganQty: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={fetchHospitals}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Apply
        </button>
      </div>

      {/* Table/List */}
      <div className="bg-white p-6 rounded-xl shadow overflow-auto">
        {hospitals.length === 0 ? (
          <p>No hospitals found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2">Blood Inventory</th>
                <th className="py-2">Organ Inventory</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((h) => (
                <tr key={h.id || h.name} className="border-b">
                  <td className="py-2">{h.name}</td>
                  <td className="py-2">{h.location}</td>
                  <td className="py-2">
                    {h.bloodInventory
                      ? Object.entries(h.bloodInventory)
                          .map(([type, qty]) => `${type}: ${qty}`)
                          .join(", ")
                      : "N/A"}
                  </td>
                  <td className="py-2">
                    {h.organInventory
                      ? Object.entries(h.organInventory)
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

export default ManageHospitalsPage;
