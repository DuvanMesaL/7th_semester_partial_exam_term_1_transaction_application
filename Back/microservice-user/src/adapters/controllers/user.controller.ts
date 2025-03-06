import axios from "axios";
import { Request, Response } from "express";
import { CreateUserUseCase } from "../../app/use-cases/create-user.use-case";
import { GetUserUseCase } from "../../app/use-cases/get-user.use-case";
import { UpdateUserUseCase } from "../../app/use-cases/update-user.use.case";
import { DeleteUserUseCase } from "../../app/use-cases/delete-user.use-case";
import { UserRepositoryImpl } from "../../app/repositories/user.repository.impl";

// 📌 Instanciamos el repositorio y los casos de uso
const userRepository = new UserRepositoryImpl();
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await createUserUseCase.execute(req.body);

      await axios.post("http://localhost:3003/mail/send-welcome", {
        to: user.email,
        payload: { name: user.name }
      });
  
      res.status(201).json({mensaje: "Usuario registrado exitosamete", data:user});
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await getUserUseCase.getById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ message: "El email es requerido." });
        return;
      }
      const user = await getUserUseCase.getByEmail(email);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await updateUserUseCase.execute(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await deleteUserUseCase.execute(req.params.id);
      res.json({ message: "Usuario eliminado correctamente." });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

// 📌 Exportamos una instancia correctamente
export default new UserController();