import express from "express";
import cors from "cors";
import mailRoutes from "./adapters/routes/mail.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas
app.use("/mail", mailRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Microservicio de mailing corriendo en el puerto ${PORT}`);
});
