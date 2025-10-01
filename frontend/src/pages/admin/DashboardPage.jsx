import React from "react";

const DashboardPage = () => {
  // Dummy data
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ];

  const hospitals = [
    { id: 1, name: "City Hospital", location: "Mumbai" },
    { id: 2, name: "Green Care", location: "Pune" },
  ];

  const bloodbanks = [
    { id: 1, name: "Red Cross", city: "Mumbai" },
    { id: 2, name: "Life Blood Bank", city: "Pune" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{users.length}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Hospitals</h2>
          <p className="text-3xl mt-2">{hospitals.length}</p>
        </div>
        <div className="p-4 bg-red-100 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Blood Banks</h2>
          <p className="text-3xl mt-2">{bloodbanks.length}</p>
        </div>
      </div>

      {/* Users table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <button className="px-3 py-1 bg-red-500 text-white rounded mr-2">
                    Delete
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hospitals table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Hospitals</h2>
        <ul className="list-disc pl-6">
          {hospitals.map((h) => (
            <li key={h.id}>
              {h.name} - {h.location}{" "}
              <button className="px-2 py-1 bg-red-500 text-white rounded ml-2">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Blood Banks table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Blood Banks</h2>
        <ul className="list-disc pl-6">
          {bloodbanks.map((b) => (
            <li key={b.id}>
              {b.name} - {b.city}{" "}
              <button className="px-2 py-1 bg-red-500 text-white rounded ml-2">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
