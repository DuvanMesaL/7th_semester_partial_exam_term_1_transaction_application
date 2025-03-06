import { Request, Response } from "express";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { AuthService } from "../../app/services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      
      // Log exitoso
      await logEvent("user", "SUCCESS", `Usuario ${email} inició sesión correctamente`);

      res.json(data);
    } catch (error: any) {
      // Log de error
      await logEvent("user", "ERROR", `Error en login de ${req.body.email}: ${error.message}`);
      
      res.status(401).json({ message: error.message });
    }
  }
}
