import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHospital, FaTint , FaUsers} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
      {
      title: "Manage Users",
      icon: <FaUsers />,
      route: "/admin/manage-users",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    {
      title: "Manage Donors",
      icon: <FaUser />,
      route: "/admin/manage-donors",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "Manage Blood Banks",
      icon: <FaTint />,
      route: "/admin/manage-bloodbanks",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Manage Hospitals",
      icon: <FaHospital />,
      route: "/admin/manage-hospitals",
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

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className={`cursor-pointer relative rounded-3xl overflow-hidden ${card.bgColor} 
                        p-8 flex flex-col items-center justify-center shadow-md hover:shadow-xl
                        transition-shadow duration-300 transform-gpu group`}
          >
            {/* Icon */}
            <div
              className={`mb-4 p-4 rounded-full bg-white shadow-sm ${card.iconColor} text-2xl
                          flex items-center justify-center transform transition-transform duration-300
                          group-hover:scale-110 group-hover:rotate-3`}
            >
              {card.icon}
            </div>

            {/* Title */}
            <h2
              className="text-xl font-semibold text-gray-900 text-center transition-colors
                         group-hover:text-red-600"
            >
              {card.title}
            </h2>

            <p className="text-gray-600 mt-1 text-sm text-center">
              Click to manage {card.title.toLowerCase()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
