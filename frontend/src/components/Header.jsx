import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const [showDropdown, setShowDropdown] = useState(false);

  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload.role === "admin";
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setShowDropdown(false);
    navigate("/login");
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },
    { name: "Search", path: "/search" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <span className="text-2xl font-bold text-red-700">SaviourSync</span>
        </NavLink>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-red-100 text-red-700"
                    : "text-gray-700 hover:text-red-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

         {isAdmin && (
  <NavLink
    to="/admin/dashboard"
    className={({ isActive }) =>
      `ml-4 px-3 py-2 rounded-md font-medium transition 
      border-2 border-red-700
      ${isActive ? "bg-red-700 text-white" : "text-red-700 bg-white hover:bg-red-50"}`
    }
  >
    Dashboard
  </NavLink>
)}
 

          {/* Welcome / Login / Logout */}
          {token ? (
            <div className="relative ml-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition flex items-center gap-2"
              >
                Welcome, {username}
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showDropdown ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-700 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="ml-4 px-3 py-2 rounded-md text-gray-700 font-medium hover:text-red-700 transition"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
