import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 px-4">
      <h2 className="text-4xl font-extrabold text-red-700 mb-4 text-center">
        Contact Us
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        We'd love to hear from you! Questions, feedback, or stories – reach out and we'll respond as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-10 rounded-2xl shadow-xl space-y-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 h-40 resize-none"
          required
        />

        {success && (
          <div className="text-green-700 font-semibold text-center">
            ✅ Message sent successfully!
          </div>
        )}
        {error && (
          <div className="text-red-700 font-semibold text-center">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold shadow hover:bg-red-800 transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
