import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Tokens
  const token = localStorage.getItem("token");
  const orgToken = localStorage.getItem("orgToken");

  // User info
  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";
  const verified = localStorage.getItem("verified") === "true";

  const isAdmin = role?.toLowerCase() === "admin";

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyAsDonor = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (verified) {
      alert("You are already a verified donor!");
    } else {
      navigate("/apply-donor");
    }
  };

  const linkClasses = "px-3 py-2 rounded-md font-semibold transition duration-200";
  const activeClasses = "bg-white text-red-700 shadow-md";
  const inactiveClasses = "text-white hover:bg-red-600";

  const isDonorPage = location.pathname === "/apply-donor";

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
          <NavLink
            to="/"
            className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            Search
          </NavLink>

          {!orgToken && (
            <button
              onClick={handleApplyAsDonor}
              className={`${linkClasses} ${isDonorPage ? activeClasses : inactiveClasses}`}
            >
              Apply as Donor
            </button>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            Contact
          </NavLink>

          {/* Organization Account */}
          {orgToken ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 rounded-full bg-white text-red-700 font-semibold shadow hover:bg-gray-100 transition flex items-center gap-2 text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">
                  O
                </div>
                <span className="truncate max-w-[80px]">Organization</span>
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

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50 animate-slide-down">
                  <NavLink
                    to="/org/dashboard"
                    className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/org/manage-campaigns"
                    className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Campaigns
                  </NavLink>
                  <NavLink
                    to="/org/campaigns/create"
                    className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    Create Campaign
                  </NavLink>
                  <button
                    onClick={() => {
                      localStorage.removeItem("orgToken");
                      setShowDropdown(false);
                      navigate("/org/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : token ? (
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

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg overflow-hidden z-50 animate-slide-down">
                  <NavLink
                    to="/user/profile/me"
                    className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/campaigns/view"
                    className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    Find Campaigns
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-100 font-semibold text-sm"
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
