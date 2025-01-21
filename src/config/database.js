const mongoose = require("mongoose");
require("dotenv").config();

const connect_db = async () => {
  try {
    
    const connected = await mongoose.connect("mongodb+srv://admin:admin@cluster0.gjuq7.mongodb.net/devTinder");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB failed to connect, error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connect_db;
