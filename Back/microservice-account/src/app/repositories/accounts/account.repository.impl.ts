import { Op } from "sequelize";
import dayjs from "dayjs";
import { Account } from "../../../models/account";
import { AccountRepository } from "./account.repository";

export class AccountRepositoryImpl implements AccountRepository {
  async createAccount(userId: string, accountData: Omit<Account, "id">): Promise<Account> {
    return await Account.create({
      user_id: userId,
      number: accountData.number ?? "",
      placeholder: accountData.placeholder ?? "",
      cvc: accountData.cvc || "",
      due_date: accountData.due_date ?? dayjs().add(4, "year").format("MM/YY"),
      balance: accountData.balance ?? 0,
    });
  }

  async getAccountById(accountId: string): Promise<Account | null> {
    return await Account.findByPk(accountId);
  }

  async getAccountByUserId(userId: string): Promise<Account | null> {
    return await Account.findOne({ where: { user_id: userId } });
  }

  async getAccountByNumber(accountNumber: string): Promise<Account | null> {
    const account = await Account.findOne({ where: { number: accountNumber.toString().trim() } });
  
    return account;
  }
  
  async updateAccount(accountId: string, updatedData: Partial<Account>): Promise<Account | null> {
    const account = await Account.findByPk(accountId);
    if (!account) {
      return null;
    }
  
    await account.update(updatedData);
    await account.save();
  
    return account;
  }

  async updateAccountBalance(accountId: string, newBalance: number): Promise<void> {
    const account = await Account.findByPk(accountId);
    if (!account) {
        throw new Error("Cuenta no encontrada.");
    }

    account.balance = newBalance;
    await account.save();
  }

  async deleteAccount(accountId: string): Promise<void> {
    const account = await Account.findByPk(accountId);
    if (!account) return;
    
    await account.destroy();
  }
}