import express from "express";
import dotenv from "dotenv";
import accountRoutes from "./adapters/routes/account.routes";
import transactionRoutes from "./adapters/routes/transaction.routes";
import transferRoutes from "./adapters/routes/transfer.routes";
import { initializeDatabase } from "./infrastructure/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// 📌 ✅ Asegurar que las rutas están definidas correctamente
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);
app.use("/transfer", transferRoutes);

initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Microservicio de Cuentas corriendo en el puerto ${PORT}`));
});
