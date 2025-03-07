import { logEvent } from "../../infrastructure/utils/logEvent";
import { Request, Response } from "express";
import { CreateAccountUseCase } from "../../app/use-cases/account/create-account.use-case";
import { GetAccountUseCase } from "../../app/use-cases/account/get-account.use-case";
import { AccountRepositoryImpl } from "../../app/repositories/accounts/account.repository.impl";
import {
  MissingFieldsError,
  UnauthorizedActionError,
} from "../../exceptions/exception";

const accountRepository = new AccountRepositoryImpl();
const createAccountUseCase = new CreateAccountUseCase(accountRepository);
const getAccountUseCase = new GetAccountUseCase(accountRepository);

export class AccountController {
  static async createAccount(req: Request, res: Response): Promise<void> {
    await logEvent("account", "INFO", "Intentando crear una cuenta.");
    try {
      const { user_id, account_type, currency, initial_balance } = req.body;

      if (!user_id || !account_type || !currency) {
        await logEvent("account", "WARNING", "Faltan datos obligatorios en la creación de la cuenta.");
        throw new MissingFieldsError("user_id, account_type y currency son obligatorios.");
      }

      if (initial_balance !== undefined && initial_balance < 0) {
        await logEvent("account", "WARNING", "Intento de creación con saldo inicial negativo.");
        throw new UnauthorizedActionError("El saldo inicial no puede ser negativo.");
      }

      const account = await createAccountUseCase.execute(user_id, { account_type, currency, initial_balance });

      await logEvent("account", "INFO", `Cuenta creada con éxito para user_id: ${user_id}`);
      res.status(201).json(account);
    } catch (error: any) {
      await logEvent("account", "ERROR", `Error al crear cuenta: ${error.message}`);

      if (error instanceof MissingFieldsError || error instanceof UnauthorizedActionError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  }

  static async getAccountById(req: Request, res: Response): Promise<void> {
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
