// src/pages/admin/StatsPage.jsx
import React, { useEffect, useState } from "react";
import AdminHeaderLink from "../../components/AdminHeaderLink";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const [donorStats, setDonorStats] = useState({ labels: [], datasets: [] });
  const [bloodbankStats, setBloodbankStats] = useState({ labels: [], datasets: [] });
  const [hospitalStats, setHospitalStats] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetch("http://localhost:5000/api/donors")
      .then((res) => res.json())
      .then((donors) => {
        const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        const counts = bloodGroups.map(
          (group) => donors.filter((d) => d.bloodGroup === group).length
        );
        setDonorStats({
          labels: bloodGroups,
          datasets: [
            {
              label: "Number of Donors",
              data: counts,
              borderColor: "rgba(220, 38, 38, 0.8)",
              backgroundColor: "rgba(220, 38, 38, 0.3)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/bloodbanks")
      .then((res) => res.json())
      .then((banks) => {
        const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        const counts = bloodGroups.map((group) =>
          banks.reduce((sum, bank) => sum + (bank.bloodInventory?.[group] || 0), 0)
        );
        setBloodbankStats({
          labels: bloodGroups,
          datasets: [
            {
              label: "Blood Units in Banks",
              data: counts,
              borderColor: "rgba(34, 197, 94, 0.8)",
              backgroundColor: "rgba(34, 197, 94, 0.3)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/hospitals")
      .then((res) => res.json())
      .then((hospitals) => {
        const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        const counts = bloodGroups.map((group) =>
          hospitals.reduce((sum, h) => sum + (h.bloodInventory?.[group] || 0), 0)
        );
        setHospitalStats({
          labels: bloodGroups,
          datasets: [
            {
              label: "Blood Units in Hospitals",
              data: counts,
              borderColor: "rgba(59, 130, 246, 0.8)",
              backgroundColor: "rgba(59, 130, 246, 0.3)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch(console.error);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allow custom height
    plugins: {
      legend: { position: "top" },
    },
  };

  const chartContainerClass = "bg-white p-6 rounded-2xl shadow h-80"; // smaller height

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <AdminHeaderLink />
      <h1 className="text-4xl font-bold text-red-700 mb-10">Stats Dashboard</h1>

      <div className="grid gap-10">
        {donorStats.datasets.length > 0 && (
          <div className={chartContainerClass}>
            <h2 className="text-2xl font-semibold mb-4">Donor Statistics</h2>
            <div className="h-full">
              <Line data={donorStats} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: "Donors per Blood Group" } } }} />
            </div>
          </div>
        )}

        {bloodbankStats.datasets.length > 0 && (
          <div className={chartContainerClass}>
            <h2 className="text-2xl font-semibold mb-4">Blood Bank Statistics</h2>
            <div className="h-full">
              <Line data={bloodbankStats} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: "Blood Units in Banks" } } }} />
            </div>
          </div>
        )}

        {hospitalStats.datasets.length > 0 && (
          <div className={chartContainerClass}>
            <h2 className="text-2xl font-semibold mb-4">Hospital Statistics</h2>
            <div className="h-full">
              <Line data={hospitalStats} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: "Blood Units in Hospitals" } } }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
