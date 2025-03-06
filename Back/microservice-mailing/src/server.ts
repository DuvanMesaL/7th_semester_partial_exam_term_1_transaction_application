import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./infrastructure/databae/mongodb";
import mailRoutes from "./adapters/routes/mail.routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/mail", mailRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Mailing Service running on port ${PORT}`));
