import { AccountRepository } from "../../repositories/accounts/account.repository";
import { Account } from "../../../models/account";

export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute(userId: string, accountData: Omit<Account, "id">): Promise<Account> {
    // 📌 Verificar si el usuario ya tiene una cuenta
    const existingAccount = await this.accountRepository.getAccountByUserId(userId);
    if (existingAccount) {
      throw new Error("El usuario ya tiene una cuenta registrada.");
    }

    // 📌 Crear la cuenta
    return await this.accountRepository.createAccount(userId, accountData);
  }
}
