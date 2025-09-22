import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DonorListPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const locationHook = useLocation();
  const navigate = useNavigate();

  // Read query parameters from URL
  const query = new URLSearchParams(locationHook.search);
  const locationParam = query.get("location");
  const type = query.get("type");
  const value = query.get("value");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/donors/search?location=${locationParam}&type=${type}&value=${value}`
        );
        const data = await res.json();
        setDonors(data);
      } catch (err) {
        console.error(err);
        alert("Server error while fetching donors");
      } finally {
        setLoading(false);
      }
    };

    if (locationParam && type && value) fetchDonors();
    else setLoading(false);
  }, [locationParam, type, value]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Donor Results
      </h2>

      {/* Back Button */}
      <div className="mb-6 text-center">
        <button
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          onClick={() => navigate("/search")}
        >
          ← Back to Search
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {/* No results */}
      {!loading && donors.length === 0 && (
        <p className="text-center text-gray-600">No donors found.</p>
      )}

      {/* Results List */}
      {!loading && donors.length > 0 && (
        <ul className="max-w-lg mx-auto space-y-4">
          {donors.map((donor) => (
            <li
              key={donor._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <p>
                <strong>Name:</strong> {donor.name}
              </p>
              <p>
                <strong>Email:</strong> {donor.email}
              </p>
              <p>
                <strong>Phone:</strong> {donor.phone}
              </p>
              <p>
                <strong>Location:</strong> {donor.location}
              </p>
              <p>
                <strong>Blood Group:</strong> {donor.bloodGroup || "-"}
              </p>
              <p>
                <strong>Organ:</strong> {donor.organ || "-"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DonorListPage;
