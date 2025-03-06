import { Request, Response } from "express";
import { AuthService } from "../../app/services/auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      res.json(data);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
