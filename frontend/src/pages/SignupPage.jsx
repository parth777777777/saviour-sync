import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Signup request
      const signupResponse = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const signupText = await signupResponse.text();
      let signupData;
      try {
        signupData = JSON.parse(signupText);
      } catch {
        console.error("Could not parse signup JSON:", signupText);
        throw new Error("Invalid response from server during signup");
      }

      if (!signupResponse.ok) throw new Error(signupData.message || "Signup failed");

      // Save username/email locally
      localStorage.setItem("username", signupData.username || formData.username);
      localStorage.setItem("email", signupData.email);

      // 2️⃣ Auto-login request
      const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message || "Login failed after signup");

      // Save JWT and role
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("role", loginData.role);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md"
        onSubmit={handleSignup}
      >
        <h2 className="text-2xl font-bold text-black-700 mb-6 text-center">
          Create Account
        </h2>

        {error && <p className="text-red-700 mb-4 text-center">{error}</p>}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
