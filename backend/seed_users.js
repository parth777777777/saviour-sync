// seed_donors_400.js
require("dotenv").config();
const mongoose = require("mongoose");
const Donor = require("./models/Donor"); // update path if needed

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/saviour-sync";

// Expanded first names
const firstNames = [
  "Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Krishna","Rohan","Karan","Ansh",
  "Aisha","Saanvi","Ananya","Priya","Isha","Kavya","Tara","Neha","Sakshi","Riya",
  "Rahul","Vikram","Siddharth","Manish","Ravi","Deepak","Amit","Suresh","Nikhil","Om",
  "Mohan","Rakesh","Akash","Yash","Pranav","Tilak","Harsh","Arnav","Shaurya","Kunal",
  "Aryan","Raghav","Ishaan","Yuvraj","Kabir","Dev","Aniket","Pratyush","Abhay","Jay",
  "Meera","Diya","Anvi","Ira","Shreya","Aarohi","Kiara","Naina","Pallavi","Ragini",
  "Sneha","Divya","Bhavna","Ritika","Tanvi","Prisha","Swara","Mahika","Avni","Pari"
];

// Expanded last names
const lastNames = [
  "Sharma","Verma","Kumar","Patel","Singh","Gupta","Joshi","Reddy","Nair","Iyer",
  "Chatterjee","Ghosh","Mehta","Chowdhury","Das","Bose","Prasad","Jain","Saxena","Kapoor",
  "Shah","Khan","Naik","Thakur","Malhotra","Bhatt","Rao","Khatri","Nambiar","Lal",
  "Trivedi","Dubey","Seth","Agarwal","Mahajan","Varma","Chopra","Tiwari","Mishra","Bhardwaj",
  "Guha","Mitra","Sundaram","Nanda","Vijay","Raman","Pillai","Shukla","Bhagat","Desai"
];

const cities = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Thane", lat: 19.2183, lng: 72.9781 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
  { name: "Ludhiana", lat: 30.9010, lng: 75.8573 },
  { name: "Agra", lat: 27.1767, lng: 78.0081 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { name: "Meerut", lat: 28.9845, lng: 77.7064 },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304 },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
  { name: "Raipur", lat: 21.2514, lng: 81.6296 },
  { name: "Allahabad (Prayagraj)", lat: 25.4358, lng: 81.8463 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Vasai-Virar", lat: 19.3910, lng: 72.8397 },
  { name: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "Mysore", lat: 12.2958, lng: 76.6394 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Shimla", lat: 31.1048, lng: 77.1734 }
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFrom(arr) { return arr[randInt(0, arr.length - 1)]; }
function generatePhone() {
  const start = randomFrom(["9", "8", "7", "6"]);
  let num = start;
  for (let i = 0; i < 9; i++) num += Math.floor(Math.random() * 10);
  return num;
}
function makeEmail(name, idx) {
  const clean = name.toLowerCase().replace(/[^a-z]/g, ".");
  return `${clean}.${idx}@example.com`;
}

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to MongoDB");

  const docs = [];
  const usedEmails = new Set();

  for (let i = 0; i < 400; i++) {
    const name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    let email = makeEmail(name, i + 1);
    while (usedEmails.has(email)) email = makeEmail(name, i + 1 + Math.floor(Math.random() * 1000));
    usedEmails.add(email);

    const city = randomFrom(cities);
    docs.push({
      name,
      email,
      phone: generatePhone(),
      location: city.name,
      locationCoords: { type: "Point", coordinates: [city.lng, city.lat] },
      bloodGroup: randomFrom(bloodGroups),
      organ: null,
      createdBy: "seed-script",
    });
  }

  try {
    const result = await Donor.insertMany(docs, { ordered: false });
    console.log(`Inserted ${result.length} donors`);
  } catch (err) {
    console.error("Insert error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed().catch(console.error);
