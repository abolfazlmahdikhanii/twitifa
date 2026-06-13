const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  // Database connection logic here
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to database");
    return;
  }
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/twitifa");
    console.log("Database Connected Successfully:)");
  } catch (error) {
    console.log("Database Connection Failed!");
  }
};
export default connectToDB;
