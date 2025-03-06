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
  
    // 📌 Asegurar que balance y amount sean números
    const currentBalance = parseFloat(account.balance.toString()); 
    const transactionAmount = parseFloat(transactionData.amount.toString()); 
  
    if (transactionData.type === "outcome" && currentBalance < transactionAmount) {
      throw new Error("Fondos insuficientes.");
    }
  
    const newBalance =
      transactionData.type === "income"
        ? currentBalance + transactionAmount
        : currentBalance - transactionAmount;
  
    // 📌 Convertir `toFixed(2)` de vuelta a número para evitar errores de tipo
    await this.accountRepository.updateAccount(accountId, { balance: parseFloat(newBalance.toFixed(2)) });
  
    return await this.transactionRepository.createTransaction(accountId, transactionData);
  }
  
  
}
