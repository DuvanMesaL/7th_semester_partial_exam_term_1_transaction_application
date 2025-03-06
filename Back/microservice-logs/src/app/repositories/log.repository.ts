import { Log, ILog } from "../models/log.model";

export class LogRepository {
  async createLog(logData: Partial<ILog>): Promise<ILog> {
    const log = new Log(logData);
    return await log.save();
  }

  async getAllLogs(): Promise<ILog[]> {
    return await Log.find().sort({ timestamp: -1 });
  }
}
