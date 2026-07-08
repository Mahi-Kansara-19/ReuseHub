const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const emails = ["mahi.kansara1904@gmail.com", "rishikashah2674@gmail.com"];

    for (const email of emails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`User found: ${email}, Role: ${user.role}`);
        if (user.role !== "admin") {
          user.role = "admin";
          await user.save();
          console.log(`Updated user ${email} to admin role`);
        }
      } else {
        console.log(`User NOT found: ${email}. Creating default admin user...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Mahi19Rishika26", salt);
        await User.create({
          businessName: "ReuseHub Admin",
          ownerName: email === "mahi.kansara1904@gmail.com" ? "Mahi Kansara" : "Rishika Shah",
          email,
          password: hashedPassword,
          phone: "1234567890",
          businessCategory: "Other",
          location: "India",
          accountType: "supplier",
          role: "admin"
        });
        console.log(`Created admin user: ${email} with password Mahi19Rishika26`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
