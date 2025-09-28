import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";

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
    navigate("/login");
  };

  const linkClasses = "px-3 py-2 rounded-md font-semibold transition duration-200";
  const activeClasses = "bg-white text-red-700 shadow-md"; 
  const inactiveClasses = "text-white hover:bg-red-600";

  return (
    <header className="bg-red-700 shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="SaviourSync Logo" className="h-12 w-auto relative top-1" />
          <h1 className="text-2xl font-bold text-white">SaviourSync</h1>
        </NavLink>

        {/* Navigation */}
        <nav className="flex space-x-4 items-center">
          <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Home
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Register
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Search
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            Contact
          </NavLink>

          {/* Admin Link */}
          {isAdmin && (
            <NavLink to="/donors" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              Donor List
            </NavLink>
          )}

          {/* Login / Welcome / Logout */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 py-2 rounded-full bg-white text-red-700 font-semibold shadow hover:bg-gray-100 transition flex items-center gap-2"
              >
                Welcome, {username}
                <svg
                  className={`w-4 h-4 transform transition-transform ${showDropdown ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown only visible when showDropdown is true */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-100 transition font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
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
