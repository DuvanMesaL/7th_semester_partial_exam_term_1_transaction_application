import { Request, Response } from "express";
import { LogService } from "../../app/services/log.service";
import { LogRepository } from "../../app/repositories/log.repository";

const logService = new LogService(new LogRepository());

export class LogController {
  static async createLog(req: Request, res: Response): Promise<void> {
    try {
      const { service, level, message, data } = req.body;
      const log = await logService.createLog(service, level, message, data);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(500).json({ message: "Error registrando log", error: error.message });
    }
  }

  static async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await logService.getAllLogs();
      res.status(200).json(logs);
    } catch (error: any) {
      res.status(500).json({ message: "Error obteniendo logs", error: error.message });
    }
  }
}
