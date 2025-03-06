import { TransactionRepository } from "../../repositories/transactions/transaction.repository";
import { AccountRepository } from "../../repositories/accounts/account.repository";
import { Transaction } from "../../../models/transaction";

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(accountId: string, transactionData: Omit<Transaction, "id">): Promise<Transaction> {
    const account = await this.accountRepository.getAccountById(accountId);
    if (!account) {
      throw new Error("La cuenta no existe.");
    }

    if (transactionData.type === "outcome" && account.balance < transactionData.amount) {
      throw new Error("Fondos insuficientes.");
    }

    const newBalance =
      transactionData.type === "income"
        ? account.balance + transactionData.amount
        : account.balance - transactionData.amount;

    await this.accountRepository.updateAccount(accountId, { balance: newBalance });

    return await this.transactionRepository.createTransaction(accountId, transactionData);
  }
}
