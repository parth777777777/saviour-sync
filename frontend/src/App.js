import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage"; // Single login page for both user/admin


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Header component */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* Single login page */}
            
          </Routes>
        </main>
        <Footer /> {/* Footer component */}
      </div>
    </Router>
  );
}

export default App;
