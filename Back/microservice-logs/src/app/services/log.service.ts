import { LogRepository } from "../repositories/log.repository";
import type { Log, ILog } from "../models/log.model";

export class LogService {
  constructor(private logRepository: LogRepository) {}

  async createLog(service: string, level: "info" | "warning" | "error", message: string, data?: any): Promise<ILog> {
    const uppercaseLevel = level.toUpperCase() as "INFO" | "WARNING" | "ERROR"; 
    return await this.logRepository.createLog({ service, level: uppercaseLevel, message, data });
  }

  async getAllLogs(filters?: { service?: string; level?: string }) {
    return await this.logRepository.getAllLogs(filters);
  }
}
