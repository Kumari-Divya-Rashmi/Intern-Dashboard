require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

async function testDB() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("MONGO_URI exists:", Boolean(process.env.MONGO_URI));
    console.log(
      "MONGO_URI starts correctly:",
      process.env.MONGO_URI?.startsWith("mongodb+srv://")
    );

    const srvAddress =
      "_mongodb._tcp.intern-dashboard-cluste.klclje6.mongodb.net";

    dns.resolveSrv(srvAddress, (error, addresses) => {
      if (error) {
        console.log("Node DNS SRV lookup failed:");
        console.log(error.message);
      } else {
        console.log("Node DNS SRV lookup success:");
        console.log(addresses);
      }
    });

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });

    console.log("MongoDB connected successfully");
    process.exit(0);
  } catch (error) {
    console.log("MongoDB connection failed:");
    console.log(error.message);
    process.exit(1);
  }
}

testDB();