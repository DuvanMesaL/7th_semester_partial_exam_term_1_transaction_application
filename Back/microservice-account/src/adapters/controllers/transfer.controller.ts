import { Request, Response } from "express";
import { TransferService } from "../../app/services/transfer.service";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import { TransactionRepositoryImpl } from "../../app/repositories/transactions/transaction.repository.impl";

const accountRepository = new AccountRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const transferService = new TransferService(accountRepository, transactionRepository);

export class TransferController {
  static async transfer(req: Request, res: Response): Promise<void> {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;

      if (!fromAccountId || !toAccountId || !amount) {
        res.status(400).json({ message: "fromAccountId, toAccountId y amount son obligatorios." });
        return;
      }

      const result = await transferService.execute(fromAccountId, toAccountId, parseFloat(amount));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
