import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import GoogleMapsProvider from "./components/GoogleMapsProvider";

// Public Pages
import Home from "./pages/public/HomePage";
import SearchPage from "./pages/public/SearchPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import ForgotPasswordPage from "./pages/public/ForgotPasswordPage";
import DonorProfile from "./pages/public/DonorProfile";
import PublicCampaignsPage from "./pages/public/PublicCampaignsPage";

// User Pages
import ProfilePage from "./pages/user/ProfilePage";
import UpdateProfilePage from "./pages/user/UpdateProfilePage";
import ApplyDonor from "./pages/public/ApplyDonor";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashBoard";
import ManageUsers from "./pages/admin/ManageUsersPage";
import ManageHospitals from "./pages/admin/ManageHospitalsPage";
import ManageDonors from "./pages/admin/ManageDonorsPage";
import ManageApplications from "./pages/admin/AdminDonorApplications";
import ManageBloodBanks from "./pages/admin/ManageBloodBanksPage";

// Org Pages
import OrgLoginPage from "./pages/org/OrgLoginPage";
import OrgSignupPage from "./pages/org/OrgSignupPage";
import ManageCampaignPage from "./pages/org/ManageCampaignPage";
import CampaignForm from "./pages/org/CampaignForm";
import OrgCampaignsPage from "./pages/org/OrgCampaignsPage";
import OrgDashboardPage from "./pages/org/OrgDashboardPage";

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
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/apply-donor" element={<ApplyDonor />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile/:userId" element={<DonorProfile />} />
              <Route path="/campaigns/view" element={<PublicCampaignsPage /> } />

              {/* Org Routes */}
              <Route path="/org/login" element={<OrgLoginPage />} />
              <Route path="/org/signup" element={<OrgSignupPage />} />
              <Route path="/org/campaigns/create" element={<CampaignForm />} />
              <Route path="/org/campaigns/:id/manage" element={<ManageCampaignPage />} />
              <Route path="/org/manage-campaigns" element={<OrgCampaignsPage />} />
              <Route path="/org/dashboard" element={<OrgDashboardPage />} />


            {/* Protected User Routes */}
              <Route
                path="/user/profile/me"
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
                path="/admin/donor-verification"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageApplications />
                  </ProtectedRoute>
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
                    <ManageBloodBanks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-donors"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageDonors />
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
