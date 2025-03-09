import { Request, Response, NextFunction } from "express";
import { MailService } from "../../app/services/mail.service";
import { sendEmail } from "../../infrastructure/utils/email-sender";
import { logEvent } from "../../infrastructure/utils/logEvent";
import {
  MissingEmailDataError,
  EmailNotSentError,
} from "../../exceptions/exception";

const mailService = new MailService();

export const sendWelcomeEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { to, payload } = req.body;

    if (!to || !payload) {
      console.error("❌ Falta el email o el payload.");
      res.status(400).json({ message: "Se requiere 'to' y 'payload' para enviar un correo." });
      return;
    }

    await logEvent("mailing", "INFO", `Intentando enviar correo de bienvenida a ${to}`);

    const subject = "Bienvenido";
    const template = "welcome";

    const emailResponse = await sendEmail(to, subject, template, payload);

    if (!emailResponse || emailResponse.rejected?.length > 0) {
      console.error("❌ Error: El servidor de correo rechazó el mensaje", emailResponse);
      res.status(500).json({ message: `No se pudo enviar el correo a ${to}` });
      return;
    }

    await logEvent("mailing", "INFO", `Correo de bienvenida enviado a ${to}`);

    res.status(200).json({ message: "Correo enviado", response: emailResponse });
  } catch (error) {
    console.error("❌ Error en sendWelcomeEmail:", error);
    next(error);
  }
};

export const sendTransactionEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, payload } = req.body;
    if (!to || !payload) {
      throw new MissingEmailDataError("Se requiere 'to' y 'payload' para enviar un correo.");
    }

    await logEvent("mailing", "INFO", `Intentando enviar correo de transacción a ${to}`);

    const subject = "Confirmación de Transacción";
    const template = "transaction";

    const emailResponse = await sendEmail(to, subject, template, payload);
    if (!emailResponse || emailResponse.rejected.length > 0) {
      throw new EmailNotSentError(`No se pudo enviar el correo a ${to}`);
    }

    await mailService.saveMail(to, subject, template, payload);
    await logEvent("mailing", "INFO", `Correo de transacción enviado a ${to}`);

    res.status(200).json({ message: "Correo de transacción enviado", response: emailResponse });
  } catch (error) {
    next(error);
  }
};


export const sendTransferEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderEmail, receiverEmail, payload } = req.body;
    if (!senderEmail || !receiverEmail || !payload) {
      throw new MissingEmailDataError("Se requiere 'senderEmail', 'receiverEmail' y 'payload' para enviar correos de transferencia.");
    }

    await logEvent("mailing", "INFO", `Intentando enviar correos de transferencia a ${senderEmail} y ${receiverEmail}`);

    const subjectSender = "Confirmación de Transferencia";
    const subjectReceiver = "Transferencia Recibida";

    const emailResponseSender = await sendEmail(senderEmail, subjectSender, "transfer-sent", payload);
    const emailResponseReceiver = await sendEmail(receiverEmail, subjectReceiver, "transfer-received", payload);

    if (!emailResponseSender || emailResponseSender.rejected.length > 0) {
      throw new EmailNotSentError(`No se pudo enviar el correo a ${senderEmail}`);
    }

    if (!emailResponseReceiver || emailResponseReceiver.rejected.length > 0) {
      throw new EmailNotSentError(`No se pudo enviar el correo a ${receiverEmail}`);
    }

    await mailService.saveMail(senderEmail, subjectSender, "transfer-sent", payload);
    await mailService.saveMail(receiverEmail, subjectReceiver, "transfer-received", payload);

    await logEvent("mailing", "INFO", `Correos de transferencia enviados a ${senderEmail} y ${receiverEmail}`);

    res.status(200).json({
      message: "Correos de transferencia enviados",
      responseSender: emailResponseSender,
      responseReceiver: emailResponseReceiver,
    });
  } catch (error) {
    next(error);
  }
};
