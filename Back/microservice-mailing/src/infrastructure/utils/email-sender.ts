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

export const sendEmail = async (to: string, subject: string, templateName: string, data: any) => {
  let template = loadTemplate(templateName);

  // Reemplazar variables en la plantilla
  Object.keys(data).forEach((key) => {
    template = template.replace(`{{${key}}}`, data[key]);
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html: template,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
