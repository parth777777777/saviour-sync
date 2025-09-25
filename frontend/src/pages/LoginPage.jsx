import React from "react";

const LoginPage = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert("Logging in...");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Login
      </h2>
      <form
        onSubmit={handleLogin}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
