import { Request, Response, NextFunction } from "express";

// Middleware para manejar errores globales
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("❌ Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
