import { AccountRepository } from "../../repositories/accounts/account.repository";
import { Account } from "../../../models/account";

export class GetAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async getById(accountId: string): Promise<Account | null> {
    return await this.accountRepository.getAccountById(accountId);
  }

  async getByUserId(userId: string): Promise<Account | null> {
    return await this.accountRepository.getAccountByUserId(userId);
  }
}
