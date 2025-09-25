import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ Your logo

const Header = () => {
  const linkClasses = "px-3 py-2 rounded-md font-medium transition duration-200";
  const activeClasses = "bg-white text-red-700 shadow-md"; // active tab style
  const inactiveClasses = "text-white hover:bg-red-600";

  return (
    <header className="bg-red-700 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="SaviourSync Logo"
            className="h-12 w-auto relative top-1"
          />
          <h1 className="text-2xl font-bold text-white">SaviourSync</h1>
        </NavLink>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Register
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/login"  // ✅ Single login page
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
