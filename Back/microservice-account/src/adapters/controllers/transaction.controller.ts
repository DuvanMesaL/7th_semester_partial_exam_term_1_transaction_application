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
  
        if (!account_id || !type || !amount) {
          res.status(400).json({ message: "account_id, type y amount son obligatorios." });
          return;
        }
  
        const transaction = await createTransactionUseCase.execute(account_id, req.body);
        res.status(201).json(transaction);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
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