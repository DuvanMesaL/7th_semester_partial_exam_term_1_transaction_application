import { Transaction } from "../../../models/transaction";

export interface TransactionRepository {
  createTransaction(accountNumber: string, transactionData: Partial<Transaction>): Promise<Transaction>;
  getTransactionsByAccount(accountId: string): Promise<Transaction[]>;
  getTransactionById(transactionId: string): Promise<Transaction | null>;
}
