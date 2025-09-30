import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; // use the existing Header component

const Home = () => {
  const sectionsRef = useRef([]);

  // Auto-scroll handler
  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return;

      const delta = e.deltaY;
      const currentSectionIndex = sectionsRef.current.findIndex(
        (sec) =>
          sec.getBoundingClientRect().top >= 0 &&
          sec.getBoundingClientRect().top < window.innerHeight
      );

      let nextIndex = currentSectionIndex;
      if (delta > 0 && currentSectionIndex < sectionsRef.current.length - 1) {
        nextIndex = currentSectionIndex + 1;
      } else if (delta < 0 && currentSectionIndex > 0) {
        nextIndex = currentSectionIndex - 1;
      }

      if (nextIndex !== currentSectionIndex) {
        isScrolling = true;
        sectionsRef.current[nextIndex].scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrolling = false;
        }, 800); // animation duration
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Height of fixed header
  const headerHeight = 80; // adjust if your Header component height changes

return (
  <div className="relative">
    <Header />

    {/* Hero Section */}
    <section
      ref={(el) => (sectionsRef.current[0] = el)}
      className="h-screen bg-gradient-to-b from-red-700 to-red-600 text-white flex flex-col justify-center items-center text-center px-6 transition-all duration-700 ease-in-out"
      style={{ paddingTop: `${headerHeight}px` }}
    >
      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
        Connect. Donate. Save Lives.
      </h1>
      <p className="text-xl md:text-2xl mb-10 max-w-2xl opacity-90">
        SaviourSync links donors to recipients instantly — your blood could be the difference between life and death.
      </p>
    </section>

    {/* Features Section */}
    <section
      ref={(el) => (sectionsRef.current[1] = el)}
      className="h-screen bg-gray-50 flex flex-col justify-center items-center px-6"
      style={{ paddingTop: `${headerHeight}px` }}
    >
      <h2 className="text-3xl font-bold text-red-700 mb-12 text-center">
        Why Choose SaviourSync?
      </h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl">
        <div className="p-8 bg-white shadow-md rounded-2xl hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold mb-3">⚡ Fast Matching</h3>
          <p className="text-gray-600">
            Smart system finds compatible donors in minutes, cutting precious response time in emergencies.
          </p>
        </div>
        <div className="p-8 bg-white shadow-md rounded-2xl hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold mb-3">❤️ Life-Saving Impact</h3>
          <p className="text-gray-600">
            Every registered donor increases survival chances for patients in critical need.
          </p>
        </div>
        <div className="p-8 bg-white shadow-md rounded-2xl hover:shadow-xl transition text-center">
          <h3 className="text-xl font-semibold mb-3">🌍 Community Driven</h3>
          <p className="text-gray-600">
            Join a network of donors and hospitals working together to save lives daily.
          </p>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section
      ref={(el) => (sectionsRef.current[2] = el)}
      className="h-screen bg-red-50 text-red-700 flex flex-col justify-center items-center px-6"
      style={{ paddingTop: `${headerHeight}px` }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Be a Life Saver. Anytime, Anywhere.
      </h2>
      <p className="text-lg md:text-xl mb-8 max-w-2xl text-center">
        Register as a donor today — your donation could save someone’s life in minutes.
      </p>
      <Link
        to="/register"
        className="bg-red-700 text-white px-9 py-4 rounded-xl font-semibold shadow hover:bg-red-800 transition"
      >
        Get Started
      </Link>
    </section>
  </div>
);
};


export default Home;
