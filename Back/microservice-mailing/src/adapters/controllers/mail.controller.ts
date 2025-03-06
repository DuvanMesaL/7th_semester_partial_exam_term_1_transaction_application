import { Request, Response } from "express";
import { MailService } from "../../app/services/mail.service";
import { sendEmail } from "../../infrastructure/utils/email-sender";
import { logAction } from "../../infrastructure/utils/logger";

const mailService = new MailService();

/**
 * 📌 Endpoint para enviar un correo de bienvenida
 */
export const sendWelcomeEmail = async (req: Request, res: Response) => {
  try {
    const { to, payload } = req.body;
    const subject = "Bienvenido";
    const template = "welcome";

    // Enviar correo
    const emailResponse = await sendEmail(to, subject, template, payload);

    // Guardar en MongoDB
    await mailService.saveMail(to, subject, template, payload);

    // Registrar log
    await logAction("Mailing", `Correo de bienvenida enviado a ${to}`);

    res.status(200).json({ message: "Correo de bienvenida enviado", response: emailResponse });
  } catch (error: unknown) {
    res.status(500).json({ message: "Error enviando el correo de bienvenida", error: (error as Error).message });
  }
};

/**
 * 📌 Endpoint para enviar un correo de confirmación de transacción
 */
export const sendTransactionEmail = async (req: Request, res: Response) => {
  try {
    const { to, payload } = req.body;
    const subject = "Confirmación de Transacción";
    const template = "transaction";

    // Enviar correo
    const emailResponse = await sendEmail(to, subject, template, payload);

    // Guardar en MongoDB
    await mailService.saveMail(to, subject, template, payload);

    // Registrar log
    await logAction("Mailing", `Correo de transacción enviado a ${to}`);

    res.status(200).json({ message: "Correo de transacción enviado", response: emailResponse });
  } catch (error: unknown) {
    res.status(500).json({ message: "Error enviando el correo de transacción", error: (error as Error).message });
  }
};

/**
 * 📌 Endpoint para enviar un correo de confirmación de transferencia
 */
export const sendTransferEmail = async (req: Request, res: Response) => {
  try {
    const { senderEmail, receiverEmail, payload } = req.body;
    const subjectSender = "Confirmación de Transferencia";
    const subjectReceiver = "Transferencia Recibida";

    // 📌 1️⃣ Correo para el remitente (confirmación de transferencia)
    const templateSender = "transfer-sent";
    const payloadSender = { ...payload };

    const emailResponseSender = await sendEmail(senderEmail, subjectSender, templateSender, payloadSender);

    // 📌 2️⃣ Correo para el destinatario (recibió dinero)
    const templateReceiver = "transfer-received";
    const payloadReceiver = { ...payload };

    const emailResponseReceiver = await sendEmail(receiverEmail, subjectReceiver, templateReceiver, payloadReceiver);

    // Guardar en MongoDB
    await mailService.saveMail(senderEmail, subjectSender, templateSender, payloadSender);
    await mailService.saveMail(receiverEmail, subjectReceiver, templateReceiver, payloadReceiver);

    // Registrar logs
    await logAction("Mailing", `Correo de transferencia enviado a ${senderEmail} y ${receiverEmail}`);

    res.status(200).json({
      message: "Correos de transferencia enviados",
      responseSender: emailResponseSender,
      responseReceiver: emailResponseReceiver
    });
  } catch (error: unknown) {
    res.status(500).json({ message: "Error enviando correo de transferencia", error: (error as Error).message });
  }
};
