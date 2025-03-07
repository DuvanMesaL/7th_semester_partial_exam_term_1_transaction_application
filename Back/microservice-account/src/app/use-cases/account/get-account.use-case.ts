import { AccountRepository } from "../../repositories/accounts/account.repository";
import { Account } from "../../../models/account";
import { AccountNotFoundError } from "../../../exceptions/exception";

export class GetAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async getById(accountId: string) {
    const account = await this.accountRepository.getAccountById(accountId);
    if (!account) {
      throw new AccountNotFoundError("No se encontró la cuenta con el ID proporcionado.");
    }
    return account;
  }

  async getByUserId(userId: string): Promise<Account | null> {
    return await this.accountRepository.getAccountByUserId(userId);
  }
}
