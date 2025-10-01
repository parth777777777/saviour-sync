import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleMapsProvider from "./components/GoogleMapsProvider";

// Pages
import Home from "./pages/public/HomePage";
import RegisterPage from "./pages/public/RegisterPage";
import SearchPage from "./pages/public/SearchPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import LoginPage from "./pages/public/LoginPage"; 
import SignupPage from "./pages/public/SignupPage";
import DonorListPage from "./pages/DonorListPage";
import EditDonorPage from "./pages/EditDonorPage"; 
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <GoogleMapsProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/donors"
                element={
                  <ProtectedRoute>
                    <DonorListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <EditDonorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
