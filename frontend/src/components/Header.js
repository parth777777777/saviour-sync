import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
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
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = "px-3 py-2 rounded-md font-semibold transition duration-200";
  const activeClasses = "bg-white text-red-700 shadow-md";
  const inactiveClasses = "text-white hover:bg-red-600";

  return (
    <header className="bg-red-700 shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Brand */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="SaviourSync Logo" className="h-10 w-auto relative top-0.5" />
          <h1 className="text-xl font-bold text-white">SaviourSync</h1>
        </NavLink>

        {/* Navigation */}
        <nav className="flex space-x-4 items-center">
          <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>Home</NavLink>
          <NavLink to="/register" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>Register</NavLink>
          <NavLink to="/search" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>Search</NavLink>
          <NavLink to="/about" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>Contact</NavLink>

          {/* Admin Links */}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              Admin Dashboard
            </NavLink>
          )}

          {/* Login / Profile Dropdown */}
          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 rounded-full bg-white text-red-700 font-semibold shadow hover:bg-gray-100 transition flex items-center gap-2 text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="truncate max-w-[80px]">{username}</span>
                <svg
                  className={`w-3 h-3 transform transition-transform ${showDropdown ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg overflow-hidden z-50 animate-slide-down">
                  <NavLink
                    to="/user/profile"
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-100 transition flex items-center gap-2 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={() => { handleLogout(); setShowDropdown(false); }}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-100 transition flex items-center gap-2 font-semibold text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
