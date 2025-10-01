// src/pages/admin/UsersPage.jsx
import React, { useEffect, useState } from "react";
import AdminHeaderLink from "../../components/AdminHeaderLink";
import { FaTrash, FaEdit } from "react-icons/fa";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(""); // search/filter term
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  // Change role
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <AdminHeaderLink text="Back to Dashboard" />
      <h1 className="text-3xl font-bold text-red-700 mb-6">Manage Users</h1>

      {/* Filter input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-3 w-full max-w-md rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.username || "-"}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
