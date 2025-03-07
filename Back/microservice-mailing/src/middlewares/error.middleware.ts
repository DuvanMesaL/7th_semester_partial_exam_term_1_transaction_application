import { Request, Response, NextFunction } from "express";
import { logEvent } from "../infrastructure/utils/logEvent";
import {
  EmailServiceError,
  EmailNotSentError,
  InvalidEmailFormatError,
  MissingEmailDataError,
} from "../exceptions/exception";

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorMessage = "Error interno del servidor";

  if (err instanceof MissingEmailDataError) {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err instanceof InvalidEmailFormatError) {
    statusCode = 422;
    errorMessage = err.message;
  } else if (err instanceof EmailNotSentError) {
    statusCode = 500;
    errorMessage = err.message;
  }

  await logEvent("email", "ERROR", `Error: ${errorMessage}`);
  res.status(statusCode).json({ message: errorMessage });
};
