import { Transaction } from "../../../models/transaction";
import { TransactionRepository } from "./transaction.repository";

export class TransactionRepositoryImpl implements TransactionRepository {
  async createTransaction(accountId: string, transactionData: Omit<Transaction, "id">): Promise<Transaction> {
    return await Transaction.create({
      account_id: accountId,
      type: transactionData.type ?? "income",
      amount: transactionData.amount ?? 0,
      date: transactionData.date ?? new Date(),
      updatedAt: new Date(),
    });
  }

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    return await Transaction.findAll({ where: { account_id: accountId } });
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    return await Transaction.findByPk(transactionId);
  }
}