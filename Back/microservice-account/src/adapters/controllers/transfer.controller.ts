import axios from "axios";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { TransferService } from "../../app/services/transfer.service";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";

const accountRepository = new AccountRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const transferService = new TransferService(accountRepository, transactionRepository);

export class TransferController {
  static async transferMoney(req: Request, res: Response): Promise<void> {
    await logEvent("transfer", "INFO", "Intentando realizar una transferencia.");
    try {
      const { senderAccountId, receiverAccountId, amount } = req.body;
      const authToken = req.headers.authorization;

      if (!authToken) {
        await logEvent("transfer", "WARNING", "Intento de transferencia sin token.");
        res.status(401).json({ message: "Token de autorización requerido." });
        return;
      }

      const senderAccountResponse = await axios.get(`http://localhost:3002/account/${senderAccountId}`, {
        headers: { Authorization: authToken }
      });
      const senderUserId = senderAccountResponse.data.user_id;

      if (!senderUserId) {
        await logEvent("transfer", "WARNING", `Cuenta remitente ${senderAccountId} no tiene usuario asociado.`);
        res.status(404).json({ message: "No se encontró el usuario asociado a la cuenta remitente." });
        return;
      }

      const senderUserResponse = await axios.get(`http://localhost:3001/user/${senderUserId}`, {
        headers: { Authorization: authToken }
      });

      const senderEmail = senderUserResponse.data.email;
      if (!senderEmail) {
        await logEvent("transfer", "WARNING", `Usuario remitente ${senderUserId} no tiene email registrado.`);
        res.status(404).json({ message: "No se encontró el email del usuario remitente." });
        return;
      }

      const receiverAccountResponse = await axios.get(`http://localhost:3002/account/${receiverAccountId}`, {
        headers: { Authorization: authToken }
      });
      const receiverUserId = receiverAccountResponse.data.user_id;

      if (!receiverUserId) {
        await logEvent("transfer", "WARNING", `Cuenta destinataria ${receiverAccountId} no tiene usuario asociado.`);
        res.status(404).json({ message: "No se encontró el usuario asociado a la cuenta destinataria." });
        return;
      }

      await logEvent("transfer", "INFO", `Obteniendo datos del usuario destinatario: ${receiverUserId}`);
      const receiverUserResponse = await axios.get(`http://localhost:3001/user/${receiverUserId}`, {
        headers: { Authorization: authToken }
      });

      const receiverEmail = receiverUserResponse.data.email;
      if (!receiverEmail) {
        await logEvent("transfer", "WARNING", `Usuario destinatario ${receiverUserId} no tiene email registrado.`);
        res.status(404).json({ message: "No se encontró el email del usuario destinatario." });
        return;
      }

      await logEvent("transfer", "INFO", `Ejecutando transferencia de ${amount} de ${senderAccountId} a ${receiverAccountId}`);
      const transfer = await transferService.execute(senderAccountId, receiverAccountId, amount);

      await logEvent("transfer", "INFO", `Transferencia realizada exitosamente: ${amount} de ${senderAccountId} a ${receiverAccountId}`);

      await axios.post("http://localhost:3003/mail/send-transfer", {
        senderEmail,
        receiverEmail,
        payload: {
          sender: senderUserResponse.data.name,
          receiver: receiverUserResponse.data.name,
          amount,
          date: new Date().toISOString()
        }
      });
      
      res.status(201).json({ message: "Transferencia realizada", data: transfer });
    } catch (error: any) {
      await logEvent("transfer", "ERROR", `Error en transferencia: ${error.message}`);
      res.status(500).json({ 
        message: "Error procesando transferencia", 
        error: error.response?.data || error.message 
      });
    }
  }
}
