import mongoose from "mongoose";

interface ILog {
  service: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  data?: any;
  createdAt?: Date;
}

const LogSchema = new mongoose.Schema({
    service: { type: String, required: true },
    level: { type: String, enum: ["INFO", "WARNING", "ERROR"], required: true },
    message: { type: String, required: true },
    data: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

const Log = mongoose.model("Log", LogSchema);
export { Log, ILog };
