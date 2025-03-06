import mongoose from "mongoose";

const MailSchema = new mongoose.Schema(
  {
    payload: { type: Object, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    template: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const MailModel = mongoose.model("Mail", MailSchema);
