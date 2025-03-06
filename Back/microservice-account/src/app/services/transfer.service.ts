import { AccountRepository } from "../repositories/accounts/account.repository";
import { TransactionRepository } from "../repositories/transactions/transaction.repository";

export class TransferService {
  constructor(
    private accountRepository: AccountRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute(fromAccountId: string, toAccountId: string, amount: number) {
    console.log("📌 Ejecutando transferencia...");
    console.log("🔹 De cuenta:", fromAccountId);
    console.log("🔹 A cuenta:", toAccountId);
    console.log("🔹 Monto:", amount);
  
    // 📌 Verificar si ambas cuentas existen
    const fromAccount = await this.accountRepository.getAccountById(fromAccountId);
    const toAccount = await this.accountRepository.getAccountById(toAccountId);
  
    console.log("🔍 Cuenta de origen encontrada:", fromAccount);
    console.log("🔍 Cuenta de destino encontrada:", toAccount);
  
    if (!fromAccount) throw new Error("La cuenta de origen no existe.");
    if (!toAccount) throw new Error("La cuenta de destino no existe.");
    
    // 📌 Convertir `balance` a número
    const fromBalance = parseFloat(fromAccount.balance as unknown as string);
    const toBalance = parseFloat(toAccount.balance as unknown as string);
    
    console.log("💰 Saldo actual origen:", fromBalance);
    console.log("💰 Saldo actual destino:", toBalance);
    
    // 📌 Verificar si la cuenta origen tiene suficiente saldo
    if (fromBalance < amount) {
      throw new Error("Saldo insuficiente en la cuenta de origen.");
    }
    
    // 📌 Registrar transacción de retiro e ingreso
    await this.transactionRepository.createTransaction(fromAccountId, { type: "outcome", amount });
    await this.transactionRepository.createTransaction(toAccountId, { type: "income", amount });
    
    // 📌 Actualizar saldos
    const newFromBalance = parseFloat((fromBalance - amount).toFixed(2));
    const newToBalance = parseFloat((toBalance + amount).toFixed(2));
  
    await this.accountRepository.updateAccountBalance(fromAccountId, newFromBalance);
    await this.accountRepository.updateAccountBalance(toAccountId, newToBalance);
  
    console.log("✅ Transferencia completada");
    
    return {
      message: `Transferencia de $${amount} realizada con éxito.`,
      fromAccountId,
      toAccountId,
      newFromBalance,
      newToBalance,
    };
  }
  
}