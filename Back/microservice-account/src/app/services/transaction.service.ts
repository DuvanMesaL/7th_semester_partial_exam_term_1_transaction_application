import { AccountRepositoryImpl } from "../repositories/accounts/account.repository.impl";
import { TransactionRepositoryImpl } from "../repositories/transactions/transaction.repository.impl";

export class TransactionService {
    private accountRepository: AccountRepositoryImpl;
    private transactionRepository: TransactionRepositoryImpl;

    constructor() {
        this.accountRepository = new AccountRepositoryImpl();
        this.transactionRepository = new TransactionRepositoryImpl();
    }

    // ✅ Obtener todas las transacciones
    async getAllTransactions() {
        return await this.transactionRepository.getAllTransactions();
    }

    // ✅ Registrar una compra (resta saldo)
    async purchase(account_id: number, amount: number) {
        const account = await this.accountRepository.getAccountById(account_id);
        if (!account) throw new Error("Cuenta no encontrada.");

        if (Number(account.balance) < amount) throw new Error("Fondos insuficientes.");

        const newBalance = Number(account.balance) - amount;
        await this.accountRepository.updateBalance(account_id, newBalance);

        // Registrar la compra como "outcome"
        await this.transactionRepository.createTransaction({
            account_id,
            type: "outcome",
            amount,
        });

        return { message: "Compra realizada con éxito", newBalance };
    }

    // ✅ Transferencia de dinero entre cuentas
    async transfer(from_account_id: number, to_account_id: number, amount: number) {
        const fromAccount = await this.accountRepository.getAccountById(from_account_id);
        const toAccount = await this.accountRepository.getAccountById(to_account_id);

        if (!fromAccount || !toAccount) throw new Error("Una o ambas cuentas no existen.");
        if (Number(fromAccount.balance) < amount) throw new Error("Fondos insuficientes.");

        // Actualizar saldo de ambas cuentas
        await this.accountRepository.updateBalance(from_account_id, Number(fromAccount.balance) - amount);
        await this.accountRepository.updateBalance(to_account_id, Number(toAccount.balance) + amount);

        // Registrar las transacciones
        await this.transactionRepository.createTransaction({
            account_id: from_account_id,
            type: "outcome",
            amount,
        });

        await this.transactionRepository.createTransaction({
            account_id: to_account_id,
            type: "income",
            amount,
        });

        return { message: "Transferencia exitosa" };
    }
}
