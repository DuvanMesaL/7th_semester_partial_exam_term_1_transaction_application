import { TransactionRepository } from "../../repositories/transactions/transaction.repository";
import { Transaction } from "../../../models/transaction";

export class GetTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async getById(transactionId: string): Promise<Transaction | null> {
    return await this.transactionRepository.getTransactionById(transactionId);
  }

  async getByAccountId(accountId: string): Promise<Transaction[]> {
    return await this.transactionRepository.getTransactionsByAccount(accountId);
  }
}
