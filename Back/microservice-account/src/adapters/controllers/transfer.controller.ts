import axios from "axios";
import { Request, Response } from "express";
import { TransferService } from "../../app/services/transfer.service";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";

// 📌 Instanciar dependencias correctamente
const accountRepository = new AccountRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const transferService = new TransferService(accountRepository, transactionRepository);

export class TransferController {
  static async transferMoney(req: Request, res: Response): Promise<void> {
    try {
      const { senderAccountId, receiverAccountId, amount } = req.body;
      const authToken = req.headers.authorization;

      if (!authToken) {
        res.status(401).json({ message: "Token de autorización requerido." });
        return;
      }

      // 📌 Obtener datos del remitente
      const senderAccountResponse = await axios.get(`http://localhost:3002/account/${senderAccountId}`, {
        headers: { Authorization: authToken }
      });
      const senderUserId = senderAccountResponse.data.user_id;

      const senderUserResponse = await axios.get(`http://localhost:3001/user/${senderUserId}`, {
        headers: { Authorization: authToken }
      });

      const senderEmail = senderUserResponse.data.email;

      // 📌 Obtener datos del destinatario
      const receiverAccountResponse = await axios.get(`http://localhost:3002/account/${receiverAccountId}`, {
        headers: { Authorization: authToken }
      });
      const receiverUserId = receiverAccountResponse.data.user_id;

      const receiverUserResponse = await axios.get(`http://localhost:3001/user/${receiverUserId}`, {
        headers: { Authorization: authToken }
      });

      const receiverEmail = receiverUserResponse.data.email;

      // 📌 Realizar la transferencia usando `transferService`
      const transfer = await transferService.execute(senderAccountId, receiverAccountId, amount);

      // 📌 Enviar correos de confirmación
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
      console.error("❌ Error en transferMoney:", error.response?.status, error.response?.data || error.message);
      res.status(500).json({ 
        message: "Error procesando transferencia", 
        error: error.response?.data || error.message 
      });
    }
  }
}
