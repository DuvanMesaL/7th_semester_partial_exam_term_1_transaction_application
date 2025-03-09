import { Request, Response } from "express";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { UserRepositoryImpl } from "../../app/repositories/user.repository.impl";
import { LoginUserUseCase } from "../../app/use-cases/login-user.use-case";
import { RefreshTokenUseCase } from "../../app/use-cases/refresh-token.use-case";
import { LogoutUserUseCase } from "../../app/use-cases/logout-user.use-case";

const userRepository = new UserRepositoryImpl();
const loginUserUseCase = new LoginUserUseCase(userRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository);
const logoutUserUseCase = new LogoutUserUseCase(userRepository);

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await loginUserUseCase.execute(email, password);
      
      await logEvent("user", "SUCCESS", `Usuario ${email} inició sesión correctamente`);
      res.json(tokens);
    } catch (error: any) {
      await logEvent("user", "ERROR", `Error en login de ${req.body.email}: ${error.message}`);
      res.status(401).json({ message: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await refreshTokenUseCase.execute(refreshToken);

      res.json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      await logoutUserUseCase.execute(userId);
      res.json({ message: "Cierre de sesión exitoso." });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
