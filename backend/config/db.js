const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Programmatically override DNS to resolve MongoDB Atlas SRV records
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
      console.log("DNS servers configured to Google DNS for Atlas SRV resolution.");
    } catch (dnsErr) {
      console.warn("Custom DNS config skipped/failed:", dnsErr.message);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};


module.exports = connectDB;