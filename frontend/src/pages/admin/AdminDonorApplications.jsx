import React, { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000";

const AdminDonorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const token = localStorage.getItem("token");

  // -----------------------------
  // Fetch pending applications
  // -----------------------------
  const fetchApplications = async (pageNumber = 1) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/applications?page=${pageNumber}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }

      if (!res.ok) throw new Error(data?.message || `Server error: ${res.status}`);

      // ✅ Ensure we get an array
      setApplications(data.applications || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  // -----------------------------
  // Approve or reject application
  // -----------------------------
  const handleDecision = async (id, status) => {
    const adminNotes = prompt("Enter admin notes (optional):") || "";
    const bloodGroup = status === "Approved" ? prompt("Blood group:") || "" : "";
    const phone = status === "Approved" ? prompt("Phone:") || "" : "";
    const weight = status === "Approved" ? prompt("Weight:") || "" : "";
    const coordinates = [0, 0]; // placeholder

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/verify-donor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes, bloodGroup, phone, weight, coordinates }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }

      if (!res.ok) throw new Error(data?.message || `Server error: ${res.status}`);

      setMessage(`Application ${status}`);
      fetchApplications(page);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update application.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Pending Donor Applications</h1>

      {message && (
        <p className={`mb-4 font-semibold text-center ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-center">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div className="mb-2 md:mb-0">
                <p><strong>Name:</strong> {app.userId?.username || "-"}</p>
                <p><strong>Email:</strong> {app.userId?.email || "-"}</p>
                <p><strong>DOB:</strong> {app.dob ? new Date(app.dob).toLocaleDateString() : "-"}</p>
                <p><strong>Address:</strong> {app.address || "-"}</p>
                <p><strong>Status:</strong> {app.status}</p>
                {app.adminNotes && <p><strong>Notes:</strong> {app.adminNotes}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(app._id, "Approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(app._id, "Rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-2">{page} / {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDonorApplications;
