import { Request, Response, NextFunction } from "express";

export function validateId(req: Request<{ id: string }>, res: Response, next: NextFunction): void {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  req.params.id = userId.toString();
  next();
}

