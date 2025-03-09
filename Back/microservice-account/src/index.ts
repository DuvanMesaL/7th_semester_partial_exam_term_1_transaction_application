import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import accountRoutes from "./adapters/routes/account.routes";
import transactionRoutes from "./adapters/routes/transaction.routes";
import { initializeDatabase } from "./infrastructure/database";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);

initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Microservicio de Cuentas corriendo en el puerto ${PORT}`));
});
