import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHospital, FaTint } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Donors",
      icon: <FaUser />,
      route: "/admin/donors",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Manage Blood Banks",
      icon: <FaTint />,
      route: "/admin/bloodbanks",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Manage Hospitals",
      icon: <FaHospital />,
      route: "/admin/hospitals",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col items-center py-24 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-red-700 mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-10 w-full max-w-6xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(card.route)}
            whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`cursor-pointer relative rounded-3xl shadow-lg overflow-hidden ${card.bgColor} p-12 flex flex-col items-center justify-center hover:shadow-xl transition`}
          >
            {/* Icon */}
            <motion.div
              className={`mb-5 p-6 rounded-full bg-white shadow-md ${card.iconColor} text-3xl flex items-center justify-center`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
            >
              {card.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-semibold text-gray-900 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
            >
              {card.title}
            </motion.h2>

            <motion.p
              className="text-gray-600 mt-2 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.4, duration: 0.6 }}
            >
              Click to manage {card.title.toLowerCase()}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
