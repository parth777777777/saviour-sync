import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-red-700 mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-700">
        This is the admin area. You can manage users, blood banks, donors, and view stats here.
      </p>
    </div>
  );
};

export default AdminDashboard;
