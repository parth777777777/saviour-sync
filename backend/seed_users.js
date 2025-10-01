// seedLargeDonors.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Donor = require("./models/Donor");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/yourdb";

// ----------------- Names -----------------
const firstNames = [
  "Aarav","Vivaan","Aditya","Sai","Arjun","Rohan","Krishna","Ananya","Diya","Ishaan",
  "Kabir","Reyansh","Aanya","Saanvi","Kavya","Meera","Riya","Tanish","Ira","Shaurya",
  "Dhruv","Anika","Prisha","Advait","Yash","Atharv","Vanya","Ishita","Karan","Siddharth",
  "Tanvi","Aadhya","Ansh","Vihaan","Pranav","Lakshya","Navya","Aryan","Sanya","Arya",
  "Ayaan","Shreya","Anvi","Arnav","Raghav","Kiara","Esha","Vivika","Ritvik","Aarohi",
  "Manan","Parth","Nitya","Ritika","Tejas","Shruti","Varun","Anjali","Kshitij","Nandini",
  "Rudra","Ishika","Pranay","Tara","Yuvraj","Sanya","Samarth","Myra","Arin","Nivaan",
  "Eshan","Aarohi","Siddhi","Vivaan","Diya","Kavya","Rohan","Anika","Kabir","Saanvi",
  "Aarush","Anaya","Shaurya","Anvi","Arnav","Ira","Advik","Tanishka","Vihaan","Riya",
  "Ritvik","Meera","Aarav","Kiara","Pranav","Anaya","Dhruv","Nitya","Aryan","Sanya",
  "Parth","Anika","Kartik","Isha","Ayaan","Tara","Advait","Ritika","Atharv","Nandini",
  "Raghav","Anvi","Kunal","Ira","Varun","Meera","Siddharth","Myra","Tejas","Navya",
  "Manan","Shreya","Eshan","Aarohi","Rudra","Tara","Pranay","Kiara","Arin","Anaya",
  "Vihaan","Saanvi","Yuvraj","Ritika","Samarth","Ishika","Aarush","Nivaan","Kshitij","Anvi",
  "Rohan","Diya","Kabir","Anika","Aarav","Tanishka","Aryan","Riya","Dhruv","Meera",
  "Advait","Kiara","Pranav","Anaya","Atharv","Nitya","Raghav","Sanya","Varun","Ira",
  "Siddharth","Myra","Tejas","Navya","Manan","Shreya","Eshan","Aarohi","Rudra","Tara",
  "Pranay","Kiara","Arin","Anaya","Vihaan","Saanvi","Yuvraj","Ritika"
];

// 150+ Indian last names
const lastNames = [
  "Sharma","Verma","Gupta","Patel","Reddy","Kumar","Singh","Chowdhury","Mehta","Jain",
  "Kapoor","Nair","Joshi","Saxena","Malhotra","Desai","Chopra","Bhatia","Trivedi","Kohli",
  "Rao","Agarwal","Iyer","Ghosh","Pillai","Bhattacharya","Naidu","Khatri","Menon","Bose",
  "Sinha","Pandey","Chakraborty","Prasad","Singhal","Tandon","Lal","Mishra","Rana","Shetty",
  "Rangan","Saxena","Goyal","Joshi","Mehra","Goel","Shukla","Dubey","Chatterjee","Mahajan",
  "Sood","Kapadia","Hegde","Bajaj","Thakur","Guha","Khandelwal","Nanda","Vyas","Bedi",
  "Shukla","Talwar","Arora","Bhattacharjee","Chandra","Chatterjee","Datta","Gandhi","Jha","Kamat",
  "Malik","Marwah","Nehru","Purohit","Ranganathan","Sahasrabuddhe","Saxena","Tewari","Varma","Yadav",
  "Chauhan","Deshmukh","Kulkarni","Bhagat","Saini","Shinde","Joshi","Bhandari","Rajput","Parmar",
  "Chopra","Mathur","Kapoor","Lal","Mishra","Bose","Rao","Iyer","Sinha","Ghosh",
  "Menon","Naidu","Agarwal","Kohli","Trivedi","Mehta","Verma","Gupta","Sharma","Patel",
  "Reddy","Singh","Chowdhury","Jain","Khatri","Pillai","Malhotra","Desai","Bhatia","Arora",
  "Bhattacharya","Rangan","Saxena","Goel","Dubey","Mahajan","Kapadia","Hegde","Talwar","Bajaj",
  "Guha","Nanda","Vyas","Bedi","Thakur","Khandelwal","Nehru","Purohit","Ranganathan","Sahasrabuddhe"
];

// ----------------- Cities -----------------
// 30–40 Indian cities/towns with coords
const cities = [
  { name: "Mumbai", coords: [72.8777, 19.0760] },
  { name: "Delhi", coords: [77.1025, 28.7041] },
  { name: "Bangalore", coords: [77.5946, 12.9716] },
  { name: "Hyderabad", coords: [78.4867, 17.3850] },
  { name: "Chennai", coords: [80.2707, 13.0827] },
  { name: "Kolkata", coords: [88.3639, 22.5726] },
  { name: "Pune", coords: [73.8567, 18.5204] },
  { name: "Ahmedabad", coords: [72.5714, 23.0225] },
  { name: "Jaipur", coords: [75.7873, 26.9124] },
  { name: "Lucknow", coords: [80.9462, 26.8467] },
  { name: "Surat", coords: [72.8311, 21.1702] },
  { name: "Kanpur", coords: [80.3319, 26.4499] },
  { name: "Nagpur", coords: [79.0882, 21.1458] },
  { name: "Indore", coords: [75.8577, 22.7196] },
  { name: "Bhopal", coords: [77.4126, 23.2599] },
  { name: "Visakhapatnam", coords: [83.2185, 17.6868] },
  { name: "Patna", coords: [85.1376, 25.5941] },
  { name: "Vadodara", coords: [73.1812, 22.3072] },
  { name: "Ghaziabad", coords: [77.4250, 28.6692] },
  { name: "Ludhiana", coords: [75.8573, 30.9010] },
  { name: "Agra", coords: [78.0081, 27.1767] },
  { name: "Nashik", coords: [73.7898, 19.9975] },
  { name: "Faridabad", coords: [77.3049, 28.4089] },
  { name: "Meerut", coords: [77.7064, 28.9845] },
  { name: "Rajkot", coords: [70.8022, 22.3039] },
  { name: "Kalyan", coords: [73.1270, 19.2403] },
  { name: "Vasai", coords: [72.8361, 19.3917] },
  { name: "Vijayawada", coords: [80.6480, 16.5062] },
  { name: "Tiruchirappalli", coords: [78.6958, 10.7905] },
  { name: "Madurai", coords: [78.1198, 9.9252] },
  { name: "Jamshedpur", coords: [86.1830, 22.8046] },
  { name: "Udaipur", coords: [73.7125, 24.5770] },
  { name: "Dehradun", coords: [78.0322, 30.3165] },
  { name: "Amritsar", coords: [74.8723, 31.6340] },
];

// ----------------- Blood groups -----------------
const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
const bloodProbabilities = [0.37, 0.30, 0.22, 0.07, 0.02, 0.01, 0.01, 0.005]; 

// ----------------- Helpers -----------------
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAge() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = Math.round(num * 10 + 30);
  if (num < 18) return 18;
  if (num > 65) return 65;
  return num;
}

function randomBloodGroup() {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < bloodGroups.length; i++) {
    sum += bloodProbabilities[i];
    if (r <= sum) return bloodGroups[i];
  }
  return "O+";
}

function randomDonationHistory() {
  const history = [];
  const numDonations = Math.floor(Math.random() * 5);
  for (let i = 0; i < numDonations; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    history.push({
      type: randomChoice(["Blood", "Platelets", "Plasma"]),
      date: new Date(Date.now() - daysAgo * 24*60*60*1000),
      location: randomChoice(cities).name,
      volume: 350 + Math.floor(Math.random() * 200),
    });
  }
  return history;
}

// ----------------- Seeder -----------------
const NUM_DONORS = 2000;

async function seedDonors() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    for (let i = 0; i < NUM_DONORS; i++) {
      const firstName = randomChoice(firstNames);
      const lastName = randomChoice(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*1000)}@example.com`;
      const password = await bcrypt.hash("password123", 10);
      const age = randomAge();
      const bloodGroup = randomBloodGroup();
      const city = randomChoice(cities);
      const verified = Math.random() < 0.7;

      // Create User
      const user = await User.create({ username: fullName, email, password, role: "user" });

      // Create Donor
      await Donor.create({
        userId: user._id,
        age,
        bloodGroup,
        organs: [],
        lastDonation: new Date(Date.now() - Math.floor(Math.random() * 365*24*60*60*1000)),
        donationHistory: randomDonationHistory(),
        location: city.name,
        locationCoords: { type: "Point", coordinates: city.coords },
        phone: "9" + Math.floor(100000000 + Math.random()*900000000),
        weight: 50 + Math.floor(Math.random() * 50),
        medicalConditions: "",
        createdBy: user._id,
        verified,
      });

      if (i % 100 === 0) console.log(`Seeded ${i} donors...`);
    }

    console.log(`${NUM_DONORS} donors seeded successfully!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDonors();
