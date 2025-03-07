import express from "express";
import cors from "cors";
import mailRoutes from "./adapters/routes/mail.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { connectDB } from "./infrastructure/databae/mongodb";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos antes de levantar el servidor
connectDB().then(() => {
  console.log("✅ Servidor iniciando después de conectar a MongoDB.");
});

// Registrar rutas
app.use("/mail", mailRoutes);

// Middleware de manejo de errores
app.use((req, res, next) => {
  console.log(`📥 Petición recibida en mailing: ${req.method} ${req.url}`);
  console.log("📨 Datos del body:", req.body);
  next();
});

// Capturar errores globales
process.on("uncaughtException", (err) => {
  console.error("🔥 Error NO manejado en el servidor:", err);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Microservicio de mailing corriendo en el puerto ${PORT}`);
});
