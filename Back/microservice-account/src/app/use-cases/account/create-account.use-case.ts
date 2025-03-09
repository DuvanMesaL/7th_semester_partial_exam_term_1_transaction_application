import { AccountRepository } from "../../repositories/accounts/account.repository";
import { MissingFieldsError, AccountAlreadyExistsError } from "../../../exceptions/exception";

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(userId: string, accountData: any) {
    if (!userId) {
      throw new MissingFieldsError("user_id, account_type y currency son obligatorios.");
    }

    const existingAccount = await this.accountRepository.getAccountByUserId(userId);
    if (existingAccount) {
      throw new AccountAlreadyExistsError("El usuario ya tiene una cuenta registrada.");
    }

    return await this.accountRepository.createAccount(userId, accountData);
  }
}
