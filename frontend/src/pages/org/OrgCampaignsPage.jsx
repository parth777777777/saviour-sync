import React, { useEffect, useState } from "react";
import CampaignForm from "./CampaignForm";

/**
 * OrgCampaignsPage
 * - Fetches org campaigns
 * - Shows a modal to manage registered users
 * - Mark user as donated (includes username in prompt)
 *
 * Notes:
 * - Ensures API base URL is normalized to avoid duplicate slashes.
 * - Robust error logging to help debug server errors on mark-donated.
 */

const joinUrl = (...parts) => parts
  .map((p, i) => {
    if (i === 0) return p?.replace(/\/+$/g, ""); // trim trailing slash on first part
    return p?.replace(/^\/+|\/+$/g, ""); // trim leading+trailing slashes on others
  })
  .filter(Boolean)
  .join("/");

const OrgCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("orgToken");

  // Normalize base URL to avoid accidentally creating //api/... or /api/api/...
  const API_BASE = process.env.REACT_APP_API_URL || "";
  const ORG_CAMPAIGNS_URL = (path = "") => joinUrl(API_BASE, "api", "org", "campaigns", path);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(ORG_CAMPAIGNS_URL(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCampaigns(data.campaigns || []);
      else {
        console.error("Fetch campaigns failed:", res.status, data);
        alert(data.message || "Failed to fetch campaigns");
      }
    } catch (err) {
      console.error("Fetch campaigns error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewCampaign = (campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  /**
   * Helper to get a display name from a registered user entry.
   * Registered user object shape may vary. This tries several common fields.
   */
  const getUserDisplay = (u) => {
    if (!u) return "Unknown user";
    // if u is an object that contains nested user info (populated), try those fields
    const candidate =
      u.name ||
      u.fullName ||
      u.username ||
      (u.user && (u.user.name || u.user.username || u.user.email)) ||
      u.email ||
      u.userId ||
      (typeof u === "string" ? u : null);

    return candidate || "Unknown user";
  };

  /**
   * Mark a user as donated.
   * campaignId: id string
   * user: either user object from registeredUsers array or { userId: string }
   * amount: number
   */
 const markDonated = async (campaignId, user, amount = 0) => {
  // ✅ Handle all possible formats for user data
  const userId =
    user?.userId || // { userId: "..." }
    user?._id || // populated user object
    (typeof user === "string" ? user : null);

  if (!userId) {
    alert("Cannot determine user id for this entry.");
    console.error("Invalid user entry:", user);
    return;
  }

  const confirmMsg = `Mark ${userId} as donated for this campaign?`;
  if (!window.confirm(confirmMsg)) return;

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/org/campaigns/${campaignId}/mark-donated`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          amount,
          type: "Blood",
          location:
            campaigns.find((c) => c._id === campaignId)?.location || "",
        }),
      }
    );

    const data = await res.json();
    console.log("markDonated response:", data);

    if (res.ok) {
      alert("User marked as donated!");
      if (data.campaign) {
        setCampaigns((prev) =>
          prev.map((c) =>
            c._id === data.campaign._id ? data.campaign : c
          )
        );
        if (selectedCampaign && selectedCampaign._id === data.campaign._id)
          setSelectedCampaign(data.campaign);
      } else fetchCampaigns();
    } else {
      alert(data.message || "Failed to mark donated");
    }
  } catch (err) {
    console.error("markDonated error:", err);
    alert("Server error");
  }
};
 
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Campaigns</h1>

      {/* Campaign creation form */}
      <CampaignForm onCampaignCreated={handleNewCampaign} />

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="mt-6">No campaigns yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {campaigns.map((c) => (
            <div key={c._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{c.name}</h2>
              <p>
                {new Date(c.startDate).toLocaleDateString()} -{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </p>
              <p>{c.location}</p>
              <p>Registered Users: {Array.isArray(c.registeredUsers) ? c.registeredUsers.length : 0}</p>
              <button
                onClick={() => setSelectedCampaign(c)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Manage Campaign
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal or expandable section */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCampaign(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedCampaign.name} - Manage</h2>

            {(!selectedCampaign.registeredUsers || selectedCampaign.registeredUsers.length === 0) ? (
              <p>No registered users.</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {selectedCampaign.registeredUsers.map((u, idx) => (
                  <li key={idx} className="flex gap-3 items-center justify-between border p-2 rounded">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{getUserDisplay(u)}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {typeof u === "string" ? u : (u.user?.email || u.email || u.userId || "")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        {u.donated ? <span className="text-green-600">Donated ✅</span> : <span className="text-yellow-600">Pending ❌</span>}
                      </div>

                      {!u.donated && (
                        <button
                          onClick={() => markDonated(selectedCampaign._id, u, 350)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Mark Donated
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgCampaignsPage;
