import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./infrastructure/database";
import logRoutes from "./adapters/routes/log.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());
app.use("/logs", logRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Microservicio de Logs corriendo en el puerto ${PORT}`);
});
