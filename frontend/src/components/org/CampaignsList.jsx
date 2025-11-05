import React, { useEffect, useState } from "react";

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/campaigns/view`);
        const data = await res.json();
        if (res.ok) {
          setCampaigns(data.campaigns);
        } else {
          setError(data.message || "Failed to fetch campaigns");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {campaigns.map((campaign) => (
        <div key={campaign._id} className="border p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{campaign.name}</h3>
          <p className="text-gray-600">{campaign.location}</p>
          <p className="text-gray-500">
            {new Date(campaign.startDate).toLocaleDateString()} -{" "}
            {new Date(campaign.endDate).toLocaleDateString()}
          </p>
          <p>
            Registered Users: {campaign.registeredUsers?.length || 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CampaignsList;
