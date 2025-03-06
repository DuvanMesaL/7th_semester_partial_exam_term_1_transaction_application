import { Request, Response } from "express";
import { MailService } from "../../app/services/mail.service";
import { sendEmail } from "../../infrastructure/utils/email-sender";
import { logAction } from "../../infrastructure/utils/logger";

const mailService = new MailService();

export const sendMailController = async (req: Request, res: Response) => {
  try {
    const { to, subject, template, payload } = req.body;

    // Enviar correo
    const emailResponse = await sendEmail(to, subject, template, payload);

    // Guardar en MongoDB
    await mailService.saveMail(to, subject, template, payload);

    // Enviar log al microservicio de Logs
    await logAction("Mailing", `Correo enviado a ${to} con template ${template}`);

    res.status(200).json({ message: "Email sent successfully", response: emailResponse });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
};
