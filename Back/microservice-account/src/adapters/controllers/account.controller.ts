import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../app/use-cases/account/create-account.use-case";
import { GetAccountUseCase } from "../../app/use-cases/account/get-account.use-case";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";

// 📌 Instanciamos el repositorio y los casos de uso
const accountRepository = new AccountRepositoryImpl();
const createAccountUseCase = new CreateAccountUseCase(accountRepository);
const getAccountUseCase = new GetAccountUseCase(accountRepository);

export class AccountController {
  static async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.user_id;
      const accountData = req.body;

      if (!userId) {
        res.status(400).json({ message: "El user_id es obligatorio." });
        return;
      }

      const account = await createAccountUseCase.execute(userId, accountData);
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const account = await getAccountUseCase.getById(id);

      if (!account) {
        res.status(404).json({ message: "Cuenta no encontrada." });
        return;
      }

      res.json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAccountByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const account = await getAccountUseCase.getByUserId(userId);

      if (!account) {
        res.status(404).json({ message: "Cuenta no encontrada." });
        return;
      }

      res.json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
