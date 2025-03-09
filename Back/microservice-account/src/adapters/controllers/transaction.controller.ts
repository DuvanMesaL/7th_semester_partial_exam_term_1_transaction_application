import axios from "axios";
import { sendEmail } from "../../infrastructure/utils/sendEmail";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { TransferFundsUseCase } from "../../app/use-cases/transaction/transfer.use-case";
import { CreateTransactionUseCase } from "../../app/use-cases/transaction/create-transaction.use-case";
import { GetTransactionUseCase } from "../../app/use-cases/transaction/get-transaction.use-case";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import {
  AccountNotFoundError,
  InsufficientFundsError,
  UnauthorizedActionError,
  MissingFieldsError,
  InvalidTransactionError,
} from "../../exceptions/exception";

const transactionRepository = new TransactionRepositoryImpl();
const accountRepository = new AccountRepositoryImpl();
const getTransactionUseCase = new GetTransactionUseCase(transactionRepository);
const transferFundsUseCase = new TransferFundsUseCase(accountRepository, transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, accountRepository);

export class TransactionController {
  static async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { accountNumber, type, amount } = req.body;
      const authToken = req.headers.authorization;
  
      if (!authToken) {
        await logEvent("transaction", "WARNING", "Intento de transacción sin token.");
        res.status(401).json({ message: "Token de autorización requerido." });
        return; 
      }
  
      if (!accountNumber || !type || !amount) {
        await logEvent("transaction", "WARNING", "Faltan datos en la transacción.");
        res.status(400).json({ message: "accountNumber, type y amount son obligatorios." });
        return;
      }
  
      let accountResponse;
      try {
        accountResponse = await axios.get(`http://localhost:3002/account/number/${accountNumber}`, {
          headers: { Authorization: authToken }
        });
      } catch (err: any) {
        await logEvent("transaction", "WARNING", `Error al obtener la cuenta: ${err.message}`);
        res.status(500).json({ message: `Error al obtener la cuenta: ${err.message}` });
        return;
      }
  
      if (!accountResponse.data) {
        await logEvent("transaction", "WARNING", `Cuenta con número ${accountNumber} no encontrada.`);
        res.status(404).json({ message: "No se encontró la cuenta asociada." });
        return;
      }
  
      const user_id = accountResponse.data.user_id;
      if (!user_id) {
        await logEvent("transaction", "WARNING", `Cuenta ${accountNumber} no tiene usuario asociado.`);
        res.status(404).json({ message: "No se encontró el usuario asociado a esta cuenta." });
        return;
      }
  
      let userResponse;
      try {
        userResponse = await axios.get(`http://localhost:3001/user/${user_id}`, {
          headers: { Authorization: authToken }
        });
      } catch (err: any) {
        await logEvent("transaction", "WARNING", `Error al obtener el usuario: ${err.message}`);
        res.status(500).json({ message: `Error al obtener el usuario: ${err.message}` });
        return; 
      }
  
      const userEmail = userResponse.data?.email;
      if (!userEmail) {
        await logEvent("transaction", "WARNING", `Usuario ${user_id} no tiene email registrado.`);
        res.status(404).json({ message: "No se encontró el email del usuario." });
        return; 
      }
  
      const accountId = accountResponse.data.id;

      let transaction;
      try {
        transaction = await createTransactionUseCase.execute(accountId, req.body);
      } catch (err: any) {
        await logEvent("transaction", "ERROR", `Error al crear la transacción: ${err.message}`);
        res.status(500).json({ message: `Error al crear la transacción: ${err.message}` });
        return;
      }
      
  
      await logEvent("transaction", "INFO", `Transacción creada con éxito: ID ${transaction.id}, Tipo ${type}`);
  
      try {
        await sendEmail(null, userEmail, "transaction", {
          name: userResponse.data.name,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date.toISOString(),
        });
      } catch (err: any) {
        await logEvent("transaction", "WARNING", `Error al enviar el correo: ${err.message}`);
      }
  
      res.status(201).json({ message: "Transacción realizada", data: transaction });
      return; 
  
    } catch (error: any) {
      await logEvent("transaction", "ERROR", `Error en transacción: ${error.message}`);
      res.status(500).json({ message: `Error al crear la transacción: ${error.message}` });
      return;
    }
  }
  
  static async getTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const transaction = await getTransactionUseCase.getById(req.params.id);

      if (!transaction) {
        await logEvent("transaction", "WARNING", `Transacción no encontrada: ID ${req.params.id}`);
        res.status(404).json({ message: "Transacción no encontrada." });
        return;
      }

      await logEvent("transaction", "INFO", `Transacción consultada: ID ${req.params.id}`);
      res.json(transaction);
    } catch (error: any) {
      await logEvent("transaction", "ERROR", `Error al obtener transacción: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  static async getTransactionsByAccountId(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await getTransactionUseCase.getByAccountId(req.params.accountId);

      if (!transactions.length) {
        await logEvent("transaction", "WARNING", `No hay transacciones registradas en la cuenta: ${req.params.accountId}`);
        res.status(404).json({ message: "No hay transacciones registradas." });
        return;
      }

      await logEvent("transaction", "INFO", `Se consultaron ${transactions.length} transacciones para la cuenta: ${req.params.accountId}`);
      res.json(transactions);
    } catch (error: any) {
      await logEvent("transaction", "ERROR", `Error al obtener transacciones: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  static async transferMoney(req: Request, res: Response): Promise<void> {
    try {
      const { senderAccountNumber, receiverAccountNumber, amount } = req.body;
      const authToken = req.headers.authorization;

      if (!authToken) {
        throw new UnauthorizedActionError("Token de autorización requerido.");
      }

      if (!senderAccountNumber || !receiverAccountNumber || !amount) {
        throw new MissingFieldsError("senderAccountNumber, receiverAccountNumber y amount son obligatorios.");
      }

      console.log("🔄 Ejecutando transferencia...");
      const transferResult = await transferFundsUseCase.execute(senderAccountNumber, receiverAccountNumber, amount, authToken);

      await logEvent("transfer", "INFO", `Transferencia de $${amount} realizada de ${senderAccountNumber} a ${receiverAccountNumber}`);

      res.status(201).json({ message: "Transferencia realizada", data: transferResult });

    } catch (error: any) {
      console.log("❌ Error en transferencia:", error.message);
      await logEvent("transfer", "ERROR", `Error en transferencia: ${error.message}`);

      if (
        error instanceof AccountNotFoundError ||
        error instanceof InsufficientFundsError ||
        error instanceof InvalidTransactionError ||
        error instanceof MissingFieldsError
      ) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  }
}
