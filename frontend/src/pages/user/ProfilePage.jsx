import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaEnvelope, FaBirthdayCake, FaMapMarkerAlt, 
  FaHeartbeat, FaPhone, FaWeight 
} from "react-icons/fa";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const user = await userRes.json();
        setUserData(user);

        // Fetch donor data if exists
        const donorRes = await fetch(`http://localhost:5000/api/donors/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (donorRes.ok) {
          const donor = await donorRes.json();
          setDonorData(donor);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
    else setError("User not logged in");
  }, [token]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  // Donation stats calculations
  const totalDonations = donorData?.donationHistory?.length || 0;
  const totalVolume = donorData?.donationHistory?.reduce((sum, d) => sum + (d.volume || 0), 0) || 0;
  const lastDonation = donorData?.donationHistory?.length 
    ? new Date(Math.max(...donorData.donationHistory.map(d => new Date(d.date)))).toLocaleDateString()
    : "N/A";

  return (
    <motion.div
      className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-4xl">
            {userData.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-red-700">{userData.username}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <p className="capitalize text-gray-500">{userData.role}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/update-profile")}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
          >
            Update Profile
          </button>
          {donorData && !donorData.verified && (
            <button
              onClick={() => alert("Verification process coming soon!")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
            >
              Get Verified
            </button>
          )}
        </div>

        {/* Donation Stats */}
        {donorData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col items-center">
              <span className="text-gray-500 font-semibold">Total Donations</span>
              <motion.span
                className="text-red-700 font-bold text-xl"
                initial={{ count: 0 }}
                animate={{ count: totalDonations }}
                transition={{ duration: 1.5 }}
              >
                {totalDonations}
              </motion.span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col items-center">
              <span className="text-gray-500 font-semibold">Total Volume</span>
              <motion.span
                className="text-red-700 font-bold text-xl"
                initial={{ count: 0 }}
                animate={{ count: totalVolume }}
                transition={{ duration: 1.5 }}
              >
                {totalVolume} ml
              </motion.span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col items-center">
              <span className="text-gray-500 font-semibold">Last Donation</span>
              <motion.span
                className="text-red-700 font-bold text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                {lastDonation}
              </motion.span>
            </div>
          </div>
        )}

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donorData ? (
            <>
              <div className="flex items-center gap-3 text-gray-700">
                <FaBirthdayCake className="text-red-500" />
                <span>Age: {donorData.age || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaHeartbeat className="text-red-500" />
                <span>Blood Group: {donorData.bloodGroup || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaMapMarkerAlt className="text-red-500" />
                <span>Location: {donorData.location || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaPhone className="text-red-500" />
                <span>Phone: {donorData.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaWeight className="text-red-500" />
                <span>Weight: {donorData.weight ? `${donorData.weight} kg` : "N/A"}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <FaUser className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold">Organs Available:</p>
                  <p>{donorData.organs?.length ? donorData.organs.join(", ") : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-700 col-span-2">
                <FaUser className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold">Medical Conditions:</p>
                  <p>{donorData.medicalConditions || "None"}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="col-span-2 text-gray-500">You are not registered as a donor yet.</p>
          )}
        </div>

        {/* Donation History */}
        {donorData?.donationHistory?.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">Donation History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donorData.donationHistory.map((donation, idx) => (
                <div key={idx} className="border rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition">
                  <p><span className="font-semibold">Type:</span> {donation.type}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(donation.date).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Location:</span> {donation.location}</p>
                  <p><span className="font-semibold">Volume:</span> {donation.volume} ml</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
