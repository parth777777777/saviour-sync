import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const CampaignForm = ({ onCampaignCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    coordinates: [0, 0],
  });

  const token = localStorage.getItem("orgToken");
  const autocompleteRef = useRef(null);
  const navigate = useNavigate(); // hook to redirect

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setFormData({
          ...formData,
          location: place.formatted_address || place.name,
          coordinates: [
            Number(place.geometry.location.lng()),
            Number(place.geometry.location.lat()),
          ],
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      locationCoords: {
        type: "Point",
        coordinates: formData.coordinates,
      },
    };

    console.log("Submitting payload:", payload);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/org/campaigns/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        alert("Campaign created!");
        onCampaignCreated?.(data.campaign);

        // Redirect to dashboard
        navigate("/org/dashboard");

        // Reset form
        setFormData({ name: "", startDate: "", endDate: "", location: "", coordinates: [0, 0] });
      } else {
        alert(data.message || "Failed to create campaign");
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="pt-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-2 border p-4 rounded shadow max-w-md mx-auto"
      >
        <input
          type="text"
          placeholder="Campaign Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </Autocomplete>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
