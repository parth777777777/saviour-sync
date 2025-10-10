import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Droplet, Calendar, User, Mail, Weight, Activity } from "lucide-react";

export default function DonorProfile() {
  const { userId } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDonor = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/donor/public/${userId}`);

      const text = await res.text(); // read raw text first
      console.log("Raw response:", text);

      const data = JSON.parse(text); // try parsing manually
      if (!res.ok) throw new Error(data.message || "Failed to fetch donor data");
      setDonor(data.donor);
    } catch (err) {
      console.error("Error fetching donor:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

    fetchDonor();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading donor profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Donor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-16 px-6">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
              <User className="text-red-500 w-12 h-12" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{donor.name}</h1>
          <p className="text-gray-500 text-sm">{donor.email || "No email available"}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoCard icon={<Droplet className="text-red-500" />} label="Blood Group" value={donor.bloodGroup} />
          <InfoCard icon={<Calendar className="text-blue-500" />} label="Last Donation" value={donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "Not donated yet"} />
          <InfoCard icon={<Weight className="text-yellow-500" />} label="Weight" value={`${donor.weight || "N/A"} kg`} />
          <InfoCard icon={<Activity className="text-green-500" />} label="Age" value={`${donor.age || "N/A"} years`} />
          <InfoCard icon={<MapPin className="text-purple-500" />} label="Location" value={donor.location} />
          <InfoCard icon={<Calendar className="text-indigo-500" />} label="Member Since" value={new Date(donor.createdAt).toLocaleDateString()} />
        </div>

        {/* Medical & Donation History */}
        <div className="mt-10 space-y-6">
          <Section title="Medical History">
            {donor.medicalHistory?.length ? (
              <ul className="list-disc list-inside text-gray-700">
                {donor.medicalHistory.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No medical history provided.</p>
            )}
          </Section>

          <Section title="Donation History">
            {donor.donationHistory?.length ? (
              <ul className="list-disc list-inside text-gray-700">
                {donor.donationHistory.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No donation history available.</p>
            )}
          </Section>
        </div>
      </motion.div>
    </div>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
    <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="bg-gray-50 rounded-xl p-4">{children}</div>
  </div>
);
