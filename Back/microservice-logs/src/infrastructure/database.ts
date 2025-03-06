import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/logsDB";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a la base de datos de Logs.");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    process.exit(1);
  }
};
