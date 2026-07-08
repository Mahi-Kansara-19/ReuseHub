const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const salt1 = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash("mahi@1234", salt1);
    await User.updateOne(
      { email: "mahi.kansara1904@gmail.com" },
      { $set: { password: hash1, role: "admin" } }
    );
    console.log("Updated mahi.kansara1904@gmail.com password to mahi@1234");

    const salt2 = await bcrypt.genSalt(10);
    const hash2 = await bcrypt.hash("rishika@1234", salt2);
    await User.updateOne(
      { email: "rishikashah2674@gmail.com" },
      { $set: { password: hash2, role: "admin" } }
    );
    console.log("Updated rishikashah2674@gmail.com password to rishika@1234");

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
