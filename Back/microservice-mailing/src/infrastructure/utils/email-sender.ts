import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { loadTemplate } from "./template-loader";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


export const sendEmail = async (to: string, subject: string, templateName: string, payload: Record<string, string>) => {
  try {
    const html = loadTemplate(templateName, payload);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    throw error;
  }
};
