import { connect } from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await connect(process.env.MONGO_URI);
    console.log("Mongodb connected...");
  } catch (error) {
    console.error("Database not connected");
    process.exit(1);
  }
};

export default connectDB;
