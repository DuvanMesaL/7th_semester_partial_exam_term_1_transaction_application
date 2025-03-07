import { Log, ILog } from "../models/log.model";

export class LogRepository {
  async createLog(logData: Partial<ILog>): Promise<ILog> {
    const log = new Log(logData);
    return await log.save();
  }
  async getAllLogs(filters?: { service?: string; level?: string }): Promise<ILog[]> {
    const query: any = {};

    if (filters?.service) {
      query.service = filters.service;
    }

    if (filters?.level) {
      query.level = filters.level;
    }

    return await Log.find(query).sort({ createdAt: -1 });
  }
}
