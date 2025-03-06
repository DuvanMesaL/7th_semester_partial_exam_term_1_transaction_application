import { Account } from "../../../models/account";

export interface AccountRepository {
  createAccount(userId: string, accountData: Partial<Account>): Promise<Account>;
  getAccountById(accountId: string): Promise<Account | null>;
  getAccountByUserId(userId: string): Promise<Account | null>;
  updateAccount(accountId: string, updatedData: Partial<Account>): Promise<Account | null>;
  updateAccountBalance(accountId: string, newBalance: number): Promise<void>; // ✅ Agregar este método
  deleteAccount(accountId: string): Promise<void>;
}
