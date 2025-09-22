import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-red-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About SaviourSync</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Bridging the gap between donors and recipients to deliver hope, help, and life
          when it’s needed most.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To create a reliable, fast, and compassionate system that connects donors
            with recipients seamlessly — giving every patient a better chance at survival
            and every donor the opportunity to make a meaningful difference.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            A world where no life is lost waiting for a donor, and where technology and
            humanity come together to make saving lives faster, easier, and more
            accessible for everyone.
          </p>
        </div>
      </section>

      {/* Why SaviourSync */}
      <section className="bg-white py-16 px-6 flex-grow">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-700 mb-8">Why SaviourSync?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">⚡ Faster Matches</h3>
              <p className="text-gray-600">
                We prioritize urgency and proximity to make sure donations reach patients
                quickly.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">❤️ Life-Saving Impact</h3>
              <p className="text-gray-600">
                Every successful match is more than just data — it’s a life saved, a
                family healed, and hope restored.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">🌍 Community Driven</h3>
              <p className="text-gray-600">
                SaviourSync is built around people who care — donors, recipients, and
                volunteers working together to make a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-700 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg">
          Join our growing community of donors and volunteers. Every registration brings
          us closer to saving another life.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-white text-red-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Register as Donor
          </Link>
          <Link
            to="/contact"
            className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-700 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
