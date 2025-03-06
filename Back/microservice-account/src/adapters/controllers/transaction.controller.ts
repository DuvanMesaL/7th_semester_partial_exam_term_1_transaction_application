import axios from "axios";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { CreateTransactionUseCase } from "../../app/use-cases/transaction/create-transaction.use-case";
import { GetTransactionUseCase } from "../../app/use-cases/transaction/get-transaction.use-case";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";

const transactionRepository = new TransactionRepositoryImpl();
const accountRepository = new AccountRepositoryImpl();
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, accountRepository);
const getTransactionUseCase = new GetTransactionUseCase(transactionRepository);

export class TransactionController {
  static async createTransaction(req: Request, res: Response): Promise<void> {
    await logEvent("transaction", "INFO", "Intentando procesar una transacción.");
    try {
      const { account_id, type, amount } = req.body;
      const authToken = req.headers.authorization;

      if (!authToken) {
        await logEvent("transaction", "WARNING", "Intento de transacción sin token.");
        res.status(401).json({ message: "Token de autorización requerido." });
        return;
      }

      if (!account_id || !type || !amount) {
        await logEvent("transaction", "WARNING", "Faltan datos en la transacción.");
        res.status(400).json({ message: "account_id, type y amount son obligatorios." });
        return;
      }

      const accountResponse = await axios.get(`http://localhost:3002/account/${account_id}`, {
        headers: { Authorization: authToken }
      });

      const user_id = accountResponse.data.user_id;
      if (!user_id) {
        await logEvent("transaction", "WARNING", `Cuenta ${account_id} no tiene usuario asociado.`);
        res.status(404).json({ message: "No se encontró el usuario asociado a esta cuenta." });
        return;
      }

      const userResponse = await axios.get(`http://localhost:3001/user/${user_id}`, {
        headers: { Authorization: authToken }
      });

      const userEmail = userResponse.data?.email;
      if (!userEmail) {
        await logEvent("transaction", "WARNING", `Usuario ${user_id} no tiene email registrado.`);
        res.status(404).json({ message: "No se encontró el email del usuario." });
        return;
      }

      const transaction = await createTransactionUseCase.execute(account_id, req.body);
      await logEvent("transaction", "INFO", `Transacción creada con éxito: ID ${transaction.id}, Tipo ${type}`);

      await axios.post("http://localhost:3003/mail/send-transaction", {
        to: userEmail,
        payload: {
          name: userResponse.data.name,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date.toISOString()
        }
      });

      res.status(201).json({ message: "Transacción realizada", data: transaction });
    } catch (error: any) {
      await logEvent("transaction", "ERROR", `Error en transacción: ${error.message}`);
      res.status(500).json({ message: "Error procesando transacción" });
    }
  }

  static async getTransactionById(req: Request, res: Response): Promise<void> {
    await logEvent("transaction", "INFO", `Intentando obtener transacción con ID: ${req.params.id}`);
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
    await logEvent("transaction", "INFO", `Intentando obtener transacciones para la cuenta: ${req.params.accountId}`);
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
}
