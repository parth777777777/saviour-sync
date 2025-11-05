// src/pages/org/OrgDashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrgDashboardPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-20 p-8">
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        <div
          className="bg-white shadow-md rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition"
          onClick={() => handleNavigate("/org/campaigns/create")}
        >
          <h2 className="text-xl font-semibold mb-2">Create Campaign</h2>
          <p className="text-gray-600 text-center">Start a new blood donation campaign.</p>
        </div>

        <div
          className="bg-white shadow-md rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
          onClick={() => handleNavigate("/org/manage-campaigns")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Campaigns</h2>
          <p className="text-gray-600 text-center">Update donor donation history and track campaigns.</p>
        </div>
      </div>
    </div>
  );
};


export default OrgDashboardPage;
