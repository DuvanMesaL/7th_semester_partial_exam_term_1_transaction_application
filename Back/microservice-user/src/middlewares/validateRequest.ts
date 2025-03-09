import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { logEvent } from "../infrastructure/utils/logEvent";

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((err) => err.msg).join(", ");

    logEvent("user", "ERROR", `Error de validación: ${errorMessage}`)
      .catch((err) => console.error("Error registrando log:", err));

    res.status(400).json({ message: "Error de validación", errors: errors.array() });
    return;
  }

  next();
};
