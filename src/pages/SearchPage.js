const SearchPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Search for Donors
      </h2>
      <form className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-4">
        <input type="text" placeholder="Enter Location" className="w-full p-3 border rounded-lg" />
        <select className="w-full p-3 border rounded-lg">
          <option value="">Select Blood/Organ Type</option>
          <option value="blood">Blood</option>
          <option value="organ">Organ</option>
        </select>
        <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
