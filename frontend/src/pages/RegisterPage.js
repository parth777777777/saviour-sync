import { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bloodGroup: "",
    organ: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/donors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
          location: "",
          bloodGroup: "",
          organ: "",
        });
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Register as a Donor
      </h2>
      <form
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-3 border rounded-lg"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="bloodGroup"
          className="w-full p-3 border rounded-lg"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">Select Blood Type</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          name="organ"
          className="w-full p-3 border rounded-lg"
          value={formData.organ}
          onChange={handleChange}
        >
          <option value="">Select Organ (if applicable)</option>
          {["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"].map(
            (org) => (
              <option key={org} value={org}>
                {org}
              </option>
            )
          )}
        </select>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
