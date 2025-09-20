const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Contact Us
      </h2>
      <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <textarea
          placeholder="Your Message"
          className="w-full p-3 border rounded-lg h-32"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
