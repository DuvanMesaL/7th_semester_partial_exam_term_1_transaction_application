import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 SECRET_KEY en microservice-account:", process.env.SECRET_KEY);

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Acceso no autorizado. Token no proporcionado." });
    return;
  }

  const token = authHeader.split(" ")[1];

  console.log("🔍 Token recibido:", token);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    console.log("✅ Token decodificado:", decoded);

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error en la verificación del token:", error);
    res.status(401).json({ message: "Token inválido o expirado." });
  }
};
