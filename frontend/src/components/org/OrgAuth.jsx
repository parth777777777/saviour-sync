import React, { useState } from "react";

const OrgAuthForm = ({ mode = "login", onSubmit }) => {
  const [formData, setFormData] = useState({
    orgId: "",
    password: "",
    name: "",
    type: "bloodbank", // default type for signup
    location: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For login, only send orgId and password
    const dataToSend =
      mode === "login"
        ? { orgId: formData.orgId, password: formData.password }
        : formData;

    onSubmit(dataToSend);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === "login" ? "Org Login" : "Org Signup"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Organization ID</label>
          <input
            type="text"
            name="orgId"
            value={formData.orgId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {mode === "signup" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="bloodbank">Blood Bank</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default OrgAuthForm;
