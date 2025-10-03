import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaPhone, FaBirthdayCake, FaWeight, FaNotesMedical, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const PublicDonorProfile = () => {
  const { userId } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donors/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch donor data");
        const data = await res.json();
        setDonor(data.donor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, [userId]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading donor profile...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!donor) return <p className="text-center mt-20 text-gray-500">Donor not found</p>;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">{donor.username || "Donor Profile"}</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaBirthdayCake className="text-gray-400" />
            <span>Age: {donor.age}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-400" />
            <span>Phone: {donor.phone || "N/A"}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>Location: {donor.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaNotesMedical className="text-gray-400" />
            <span>Medical Conditions: {donor.medicalConditions || "None"}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaWeight className="text-gray-400" />
            <span>Weight: {donor.weight ? `${donor.weight} kg` : "N/A"}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">Blood Group:</span> {donor.bloodGroup}
          </div>

          {donor.organs && donor.organs.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-semibold">Organs for donation:</span> {donor.organs.join(", ")}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PublicDonorProfile;
