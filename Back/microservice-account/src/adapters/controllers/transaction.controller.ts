import axios from "axios";
import { Request, Response } from "express";
import { CreateTransactionUseCase } from "../../app/use-cases/transaction/create-transaction.use-case";
import { GetTransactionUseCase } from "../../app/use-cases/transaction/get-transaction.use-case";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";

// 📌 Instanciamos los repositorios y los casos de uso
const transactionRepository = new TransactionRepositoryImpl();
const accountRepository = new AccountRepositoryImpl();
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, accountRepository);
const getTransactionUseCase = new GetTransactionUseCase(transactionRepository);

export class TransactionController {
  static async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { account_id, type, amount } = req.body;
      const authToken = req.headers.authorization; // 📌 Usamos el token enviado en la petición

      if (!authToken) {
        res.status(401).json({ message: "Token de autorización requerido." });
        return;
      }

      if (!account_id || !type || !amount) {
        res.status(400).json({ message: "account_id, type y amount son obligatorios." });
        return;
      }

      // 📌 1️⃣ Obtener la cuenta desde el Microservicio de Cuentas
      const accountResponse = await axios.get(`http://localhost:3002/account/${account_id}`, {
        headers: { Authorization: authToken }
      });

      const user_id = accountResponse.data.user_id;

      if (!user_id) {
        res.status(404).json({ message: "No se encontró el usuario asociado a esta cuenta." });
        return;
      }

      // 📌 2️⃣ Obtener el usuario desde el Microservicio de Usuarios
      const userResponse = await axios.get(`http://localhost:3001/user/${user_id}`, {
        headers: { Authorization: authToken }
      });

      const userEmail = userResponse.data?.email;

      if (!userEmail) {
        res.status(404).json({ message: "No se encontró el email del usuario." });
        return;
      }

      // 📌 3️⃣ Crear la transacción usando el `use-case` como antes
      const transaction = await createTransactionUseCase.execute(account_id, req.body);

      // 📌 4️⃣ Enviar confirmación de transacción por correo
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
      console.error("Error en createTransaction:", error.message);
      res.status(500).json({ message: "Error procesando transacción" });
    }
  }
  
    static async getTransactionById(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const transaction = await getTransactionUseCase.getById(id);
  
        if (!transaction) {
          res.status(404).json({ message: "Transacción no encontrada." });
          return;
        }
  
        res.json(transaction);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  
    static async getTransactionsByAccountId(req: Request, res: Response): Promise<void> {
      try {
        const { accountId } = req.params;
        const transactions = await getTransactionUseCase.getByAccountId(accountId);
  
        if (!transactions.length) {
          res.status(404).json({ message: "No hay transacciones registradas." });
          return;
        }
  
        res.json(transactions);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  }