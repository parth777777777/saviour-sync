import React, { useEffect, useState } from "react";

const PublicCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(localStorage.getItem("token")); // JWT for logged-in user

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/campaigns/view`);
        const data = await res.json();
        if (res.ok) {
          setCampaigns(data.campaigns || []);
        } else {
          console.error(data.message || "Failed to fetch campaigns");
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleRegister = async (campaignId) => {
    if (!userToken) {
      alert("Please log in to register for a campaign");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/campaigns/${campaignId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Successfully registered!");
        // Optionally, update local state to reflect registration
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaignId ? { ...c, registered: true } : c))
        );
      } else {
        alert(data.message || "Failed to register");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during registration");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading campaigns...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming & Ongoing Campaigns</h1>
      {campaigns.length === 0 ? (
        <p className="text-center">No campaigns available right now.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => (
            <div key={c._id} className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{c.name}</h2>
                <p>
                  <strong>Location:</strong> {c.location}
                </p>
                <p>
                  <strong>Start:</strong> {new Date(c.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(c.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRegister(c._id)}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  c.registered ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={c.registered}
              >
                {c.registered ? "Registered" : "Register"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicCampaignsPage;
