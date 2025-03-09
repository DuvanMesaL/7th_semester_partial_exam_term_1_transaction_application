import { TransactionRepository } from "../../repositories/transactions/transaction.repository";
import { AccountRepository } from "../../repositories/accounts/account.repository";
import { Transaction } from "../../../models/transaction";
import { AccountNotFoundError, InsufficientFundsError, InvalidTransactionError } from "../../../exceptions/exception";

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(accountId: string, transactionData: Omit<Transaction, "id">): Promise<Transaction> {

    const account = await this.accountRepository.getAccountById(accountId);
    
    
    if (!account) {
      throw new AccountNotFoundError("No se encontró una cuenta con ese ID en la base de datos.");
    }
    
    const currentBalance = parseFloat(account.balance.toString()); 
    const transactionAmount = parseFloat(transactionData.amount.toString()); 
  
    if (transactionData.amount <= 0) {
      throw new InvalidTransactionError("El monto de la transacción debe ser mayor a cero.");
    }
  
    if (transactionData.type === "outcome" && currentBalance < transactionAmount) {
      throw new InsufficientFundsError("Fondos insuficientes.");
    }
  
    const newBalance =
      transactionData.type === "income"
        ? currentBalance + transactionAmount
        : currentBalance - transactionAmount;
  
    await this.accountRepository.updateAccount(account.id, { balance: parseFloat(newBalance.toFixed(2)) });
  
    const transaction = await this.transactionRepository.createTransaction(account.id, transactionData);
  
    return transaction;
  }
  
}
