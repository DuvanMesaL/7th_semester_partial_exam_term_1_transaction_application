import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Acceso no autorizado. Token no proporcionado." });
    return; // ✅ IMPORTANTE: Detener la ejecución con `return`
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    (req as any).user = decoded; // ✅ Agregar usuario autenticado a `req`
    next(); // ✅ Continuar con la ejecución de la ruta
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado." });
    return; // ✅ IMPORTANTE: Detener la ejecución con `return`
  }
};
