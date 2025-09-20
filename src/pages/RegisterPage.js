const RegisterPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Register as a Donor
      </h2>
      <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" required />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required />
        <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg" required />
        <input type="text" placeholder="Location" className="w-full p-3 border rounded-lg" required />

        <select className="w-full p-3 border rounded-lg">
          <option value="">Select Blood Type</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select className="w-full p-3 border rounded-lg">
          <option value="">Select Organ (if applicable)</option>
          {["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"].map((org) => (
            <option key={org}>{org}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
