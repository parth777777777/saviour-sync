import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageCampaignPage = () => {
  const { id } = useParams(); // get campaign ID from URL
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("orgToken");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/org/campaigns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setCampaign(data.campaign);
        } else {
          setError(data.message || "Failed to fetch campaign");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, token]);

  if (loading) return <div className="pt-20 text-center">Loading campaign...</div>;
  if (error) return <div className="pt-20 text-center text-red-500">{error}</div>;
  if (!campaign) return null;

  return (
    <div className="pt-20 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p>
        <strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Location:</strong> {campaign.location}
      </p>
      <p>
        <strong>Coordinates:</strong> {campaign.locationCoords.coordinates.join(", ")}
      </p>

      {/* Placeholder for actions like edit, delete, or update */}
      <div className="space-x-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => alert("Edit campaign functionality goes here")}
        >
          Edit Campaign
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => alert("Delete campaign functionality goes here")}
        >
          Delete Campaign
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => navigate("/org/campaigns")}
        >
          Back to Campaigns
        </button>
      </div>
    </div>
  );
};

export default ManageCampaignPage;
