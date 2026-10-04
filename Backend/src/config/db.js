import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing in .env");
        }

        const connection = await mongoose.connect(process.env.MONGO_URL);

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;