const mongoose = require("mongoose");
const env = require("./envConfig");

/**
 * Connect to Database.
 */
const MONGODB_URL = env.MONGODB_URL;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to database: " + error.message);
    process.exit;
  }
};

module.exports = connectDB;
