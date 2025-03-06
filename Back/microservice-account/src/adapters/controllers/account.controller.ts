import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../app/use-cases/account/create-account.use-case";
import { GetAccountUseCase } from "../../app/use-cases/account/get-account.use-case";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";

const accountRepository = new AccountRepositoryImpl();
const createAccountUseCase = new CreateAccountUseCase(accountRepository);
const getAccountUseCase = new GetAccountUseCase(accountRepository);

export class AccountController {
  static async createAccount(req: Request, res: Response): Promise<void> {
    await logEvent("account", "INFO", "Intentando crear una cuenta.");
    try {
      const userId = req.body.user_id;
      const accountData = req.body;

      if (!userId) {
        await logEvent("account", "WARNING", "Intento de creación sin user_id.");
        res.status(400).json({ message: "El user_id es obligatorio." });
        return;
      }

      const account = await createAccountUseCase.execute(userId, accountData);
      await logEvent("account", "INFO", `Cuenta creada con éxito para user_id: ${userId}`);
      
      res.status(201).json(account);
    } catch (error: any) {
      await logEvent("account", "ERROR", `Error al crear cuenta: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  static async getAccountById(req: Request, res: Response): Promise<void> {
    await logEvent("account", "INFO", `Intentando obtener cuenta con ID: ${req.params.id}`);
    try {
      const { id } = req.params;
      const account = await getAccountUseCase.getById(id);

      if (!account) {
        await logEvent("account", "WARNING", `Cuenta no encontrada: ID ${id}`);
        res.status(404).json({ message: "Cuenta no encontrada." });
        return;
      }

      await logEvent("account", "INFO", `Cuenta consultada correctamente: ID ${id}`);
      res.json(account);
    } catch (error: any) {
      await logEvent("account", "ERROR", `Error al obtener cuenta: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  static async getAccountByUserId(req: Request, res: Response): Promise<void> {
    await logEvent("account", "INFO", `Intentando obtener cuenta de usuario con ID: ${req.params.userId}`);
    try {
      const { userId } = req.params;
      const account = await getAccountUseCase.getByUserId(userId);

      if (!account) {
        await logEvent("account", "WARNING", `Cuenta no encontrada para el usuario ID: ${userId}`);
        res.status(404).json({ message: "Cuenta no encontrada." });
        return;
      }

      await logEvent("account", "INFO", `Cuenta del usuario ID ${userId} consultada correctamente.`);
      res.json(account);
    } catch (error: any) {
      await logEvent("account", "ERROR", `Error al obtener cuenta de usuario: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}
