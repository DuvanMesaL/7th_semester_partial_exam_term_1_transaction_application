import axios from "axios";
import { sendEmail } from "../../infrastructure/utils/sendEmail";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { TransferService } from "../../app/services/transfer.service";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";
import {
  AccountNotFoundError,
  InsufficientFundsError,
  UnauthorizedActionError,
  MissingFieldsError,
  InvalidTransactionError,
} from "../../exceptions/exception";

const accountRepository = new AccountRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const transferService = new TransferService(accountRepository, transactionRepository);

export class TransferController {
  static async transferMoney(req: Request, res: Response): Promise<void> {
    try {
      const { senderAccountId, receiverAccountId, amount } = req.body;
      const authToken = req.headers.authorization;

      // Validaciones iniciales
      if (!authToken) {
        throw new UnauthorizedActionError("Token de autorización requerido.");
      }

      if (!senderAccountId || !receiverAccountId || !amount) {
        throw new MissingFieldsError("senderAccountId, receiverAccountId y amount son obligatorios.");
      }

      if (amount <= 0) {
        throw new InvalidTransactionError("El monto de la transferencia debe ser mayor a cero.");
      }

      // Validar existencia de cuentas
      const senderAccount = await accountRepository.getAccountById(senderAccountId);
      if (!senderAccount) {
        throw new AccountNotFoundError("La cuenta remitente no existe.");
      }

      const receiverAccount = await accountRepository.getAccountById(receiverAccountId);
      if (!receiverAccount) {
        throw new AccountNotFoundError("La cuenta destinataria no existe.");
      }

      // Validar fondos suficientes
      if (senderAccount.balance < amount) {
        throw new InsufficientFundsError("Fondos insuficientes en la cuenta remitente.");
      }

      // Obtener información del usuario remitente
      const senderUserResponse = await axios.get(`http://localhost:3001/user/${senderAccount.user_id}`, {
        headers: { Authorization: authToken }
      });

      const senderEmail = senderUserResponse.data.email;
      if (!senderEmail) {
        throw new AccountNotFoundError("No se encontró el email del usuario remitente.");
      }

      // Obtener información del usuario destinatario
      const receiverUserResponse = await axios.get(`http://localhost:3001/user/${receiverAccount.user_id}`, {
        headers: { Authorization: authToken }
      });

      const receiverEmail = receiverUserResponse.data.email;
      if (!receiverEmail) {
        throw new AccountNotFoundError("No se encontró el email del usuario destinatario.");
      }

      // Realizar la transferencia
      await logEvent("transfer", "INFO", `Ejecutando transferencia de ${amount} de ${senderAccountId} a ${receiverAccountId}`);
      const transfer = await transferService.execute(senderAccountId, receiverAccountId, amount);

      await logEvent("transfer", "INFO", `Transferencia realizada exitosamente: ${amount} de ${senderAccountId} a ${receiverAccountId}`);

      await sendEmail(senderEmail, receiverEmail, "transfer", {
        sender: senderUserResponse.data.name,
        receiver: receiverUserResponse.data.name,
        amount,
        date: new Date().toISOString(),
      });
      
      res.status(201).json({ message: "Transferencia realizada", data: transfer });

    } catch (error: any) {
      await logEvent("transfer", "ERROR", `Error en transferencia: ${error.message}`);

      if (
        error instanceof AccountNotFoundError ||
        error instanceof InsufficientFundsError ||
        error instanceof UnauthorizedActionError ||
        error instanceof MissingFieldsError ||
        error instanceof InvalidTransactionError
      ) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  }
}
