const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  // Database connection logic here
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to database");
    return;
  }
  try {
    const mongoUri = process.env.Twitifa_MONGODB_URI;

    if (!mongoUri) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoUri, {
      dbName: "twitifa", // Your database name
    });

    console.log("Database Connected Successfully:)");
  } catch (error) {
    console.log("Database Connection Failed!");
  }
};
export default connectToDB;
