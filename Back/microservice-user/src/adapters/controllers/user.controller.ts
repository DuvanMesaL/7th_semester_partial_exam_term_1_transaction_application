import axios from "axios";
import { logEvent } from "../../infrastructure/utils/logEvent";
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

/**
 * Maneja errores centralizados para evitar repetición de código.
 * Registra logs de errores y envía la respuesta con estado 400 o 500 según sea el caso.
 */
const handleError = async (res: Response, service: string, action: string, error: any) => {
  const errorMessage = `Error en ${action}: ${error.message}`;
  console.error(errorMessage);
  
  // Enviar log de error al Microservicio de Logs
  await logEvent(service, "ERROR", errorMessage);

  res.status(400).json({ message: errorMessage });
};

class UserController {
  /**
   * Crea un nuevo usuario, envía un correo de bienvenida y registra un log de éxito.
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await createUserUseCase.execute(req.body);

      // 📩 Enviar correo de bienvenida
      await axios.post("http://localhost:3003/mail/send-welcome", {
        to: user.email,
        payload: { name: user.name }
      });

      // 📜 Registrar log de éxito
      await logEvent("user", "INFO", `Usuario ${user.email} creado correctamente`);

      res.status(201).json({ mensaje: "Usuario registrado exitosamente", data: user });
    } catch (error: any) {
      await handleError(res, "user", "crear usuario", error);
    }
  }

  /**
   * Obtiene un usuario por su ID y registra el log correspondiente.
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await getUserUseCase.getById(req.params.id);
      if (!user) {
        await logEvent("user", "WARNING", `Usuario con ID ${req.params.id} no encontrado`);
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      
      await logEvent("user", "INFO", `Usuario ${user.email} consultado correctamente`);
      res.json(user);
    } catch (error: any) {
      await handleError(res, "user", "obtener usuario por ID", error);
    }
  }

  /**
   * Obtiene un usuario por su email y registra el log correspondiente.
   */
  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ message: "El email es requerido." });
        return;
      }
      
      const user = await getUserUseCase.getByEmail(email);
      if (!user) {
        await logEvent("user", "WARNING", `Usuario con email ${email} no encontrado`);
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
      
      await logEvent("user", "INFO", `Usuario ${user.email} consultado correctamente`);
      res.json(user);
    } catch (error: any) {
      await handleError(res, "user", "obtener usuario por email", error);
    }
  }

  /**
   * Actualiza un usuario y registra logs de éxito y error.
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await updateUserUseCase.execute(req.params.id, req.body);
      if (!user) {
        await logEvent("user", "WARNING", `Usuario con ID ${req.params.id} no encontrado para actualizar`);
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }

      await logEvent("user", "INFO", `Usuario ${user.email} actualizado correctamente`);
      res.json({ mensaje: "Usuario actualizado exitosamente", data: user });
    } catch (error: any) {
      await handleError(res, "user", "actualizar usuario", error);
    }
  }

  /**
   * Elimina un usuario y registra logs de éxito y error.
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await deleteUserUseCase.execute(req.params.id);
      await logEvent("user", "WARNING", `Usuario ${req.params.id} eliminado correctamente`);

      res.json({ message: "Usuario eliminado correctamente." });
    } catch (error: any) {
      await handleError(res, "user", "eliminar usuario", error);
    }
  }
}

// 📌 Exportamos una instancia correctamente
export default new UserController();