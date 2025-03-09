import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { initializeDatabase } from "../infrastructure/database"; 
import userRoutes from "../adapters/routes/user.routes";
import authRoutes from "../adapters/routes/auth.routes";
import errorHandler from "../middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => {
  res.json({ message: "User Microservice is running" });
});

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

const startServer = async () => {
  try {
    await initializeDatabase();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`✅ User Microservice running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting the server:", error);
    process.exit(1);
  }
};

startServer();

export { app };
