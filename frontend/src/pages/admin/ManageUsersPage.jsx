import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/users?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1);
        setPage(1);
      } else {
        setUsers(data.users || []);
        setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
        setPage(data.page || 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers(page, search);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Users
      </h1>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading && (
        <p className="text-center text-gray-600 animate-pulse">
          Loading users...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered On
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username || "Unnamed"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role || "user"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm flex justify-center gap-2">
                  <button
                    onClick={() => alert("Edit user modal here")}
                    className="px-2 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft /> Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ManageUsersPage;
