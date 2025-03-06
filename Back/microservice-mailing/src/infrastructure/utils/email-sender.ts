import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { loadTemplate } from "./template-loader";

dotenv.config();

// 📌 Configurar transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes cambiarlo según tu configuración
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * 📌 Enviar un correo con la plantilla seleccionada
 */
export const sendEmail = async (to: string, subject: string, templateName: string, payload: Record<string, string>) => {
  try {
    // Cargar y procesar el template con los datos
    const html = loadTemplate(templateName, payload);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${to}:`, info.response);
    return info;
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    throw error;
  }
};
