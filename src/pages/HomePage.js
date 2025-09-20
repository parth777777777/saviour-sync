import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-red-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Syncing Lives, Saving Futures.
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          SaviourSync connects donors and recipients instantly — bringing hope
          closer when every second counts.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            Register as Donor
          </Link>
          <Link
            to="/search"
            className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition"
          >
            Find a Match
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-700 mb-12">
            Why Choose SaviourSync?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 bg-white shadow-md rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">⚡ Fast Matching</h3>
              <p className="text-gray-600">
                Smart system connects donors with recipients quickly based on
                urgency and location.
              </p>
            </div>
            <div className="p-8 bg-white shadow-md rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">❤️ Life-Saving Impact</h3>
              <p className="text-gray-600">
                Every match means a life saved, a family healed, and hope
                restored.
              </p>
            </div>
            <div className="p-8 bg-white shadow-md rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">🌍 Community Driven</h3>
              <p className="text-gray-600">
                Built for people who care — donors, recipients, and volunteers
                working together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white text-center py-20 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Be the reason someone gets a second chance at life
        </h2>
        <Link
          to="/register"
          className="bg-red-700 text-white px-9 py-4 rounded-lg font-semibold shadow hover:bg-red-800 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
