import React, { useEffect, useState } from "react";

const ManageBloodbanksPage = () => {
  const [bloodbanks, setBloodbanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBloodbanks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/manage-bloodbanks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bloodbanks");
      const data = await res.json();
      setBloodbanks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bloodbank?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/admin/manage-bloodbanks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBloodbanks();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBloodbanks();
  }, []);

  return (
    <div className="p-6 pt-24">
      <h1 className="text-3xl font-bold mb-6">Manage Bloodbanks</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {bloodbanks.map((b) => (
          <li key={b.id} className="flex justify-between p-2 border-b">
            <span>{b.name} — {b.address} — {b.phone}</span>
            <button onClick={() => handleDelete(b.id)} className="bg-red-500 text-white px-2 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageBloodbanksPage;
