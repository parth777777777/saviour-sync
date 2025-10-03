import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleMapsProvider from "./components/GoogleMapsProvider";

// Public Pages
import Home from "./pages/public/HomePage";
import RegisterPage from "./pages/public/RegisterPage";
import SearchPage from "./pages/public/SearchPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import PublicDonorProfile from "./pages/public/PublicDonorPage";

// User Pages
import ProfilePage from "./pages/user/ProfilePage";
import UpdateProfilePage from "./pages/user/UpdateProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashBoard";
import ManageUsers from "./pages/admin/ManageUsersPage";
import ManageHospitals from "./pages/admin/ManageHospitalsPage";
import ManageBloodbanks from "./pages/admin/ManageBloodbanksPage";
import ManageDonorsPage from "./pages/admin/ManageDonorsPage";

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
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile/:userId" element={<PublicDonorProfile />} />

              {/* Protected User Routes */}
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute adminOnly={false}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/update-profile"
                element={
                  <ProtectedRoute adminOnly={false}>
                    <UpdateProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/manage-donors"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageDonorsPage />
                    </ ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-hospitals"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageHospitals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-bloodbanks"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageBloodbanks />
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
