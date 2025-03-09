import axios from "axios";
import { Request, Response } from "express";
import { logEvent } from "../../infrastructure/utils/logEvent";
import { sendEmail } from "../../infrastructure/utils/sendEmail";
import { CreateUserUseCase } from "../../app/use-cases/create-user.use-case";
import { GetUserUseCase } from "../../app/use-cases/get-user.use-case";
import { UpdateUserUseCase } from "../../app/use-cases/update-user.use.case";
import { DeleteUserUseCase } from "../../app/use-cases/delete-user.use-case";
import { UserRepositoryImpl } from "../../app/repositories/user.repository.impl";
import { GetAllUsersUseCase } from "../../app/use-cases/get-all-user.use-case";

const userRepository = new UserRepositoryImpl();
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const handleError = async (res: Response, service: string, action: string, error: any) => {
  const errorMessage = `Error en ${action}: ${error.message}`;
  console.error(errorMessage);
  
  await logEvent(service, "ERROR", errorMessage);

  res.status(400).json({ message: errorMessage });
};

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await createUserUseCase.execute(req.body);

      await sendEmail(user.email, "welcome", { name: user.name });

      try {
        await axios.post("http://localhost:3002/account", {
          user_id: user.id,
          placeholder: user.name && user.lastname ? `${user.name} ${user.lastname}` : "Sin nombre",
        });

        await logEvent("account", "INFO", `Cuenta creada correctamente para ${user.email}`);
      } catch (accountError) {
        const errorMessage = accountError instanceof Error
          ? accountError.message
          : "Error desconocido al crear la cuenta.";

        console.error("Error creando la cuenta:", errorMessage);

        await logEvent("account", "ERROR", `Error creando la cuenta para ${user.email}: ${errorMessage}`);
      }
      
      await logEvent("user", "INFO", `Usuario ${user.email} creado correctamente`);

      res.status(201).json({ mensaje: "Usuario registrado exitosamente", data: user });
    } catch (error: any) {
      await handleError(res, "user", "crear usuario", error);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await getAllUsersUseCase.execute();
      await logEvent("user", "INFO", "Todos los usuarios consultados correctamente");
      res.json(users);
    } catch (error: any) {
      await handleError(res, "user", "obtener todos los usuarios", error);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await getUserUseCase.getById(req.params.id);
      if (!user) {
        await logEvent("user", "WARNING", `Usuario con ID ${req.params.id} no encontrado`);
        res.status(404).json({ message: "Usuario no encontrado." });
        return;
      }
  
      const userDTO = {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        age: user.age,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  
      await logEvent("user", "INFO", `Usuario ${user.email} consultado correctamente`);
      res.json(userDTO);
    } catch (error: any) {
      await handleError(res, "user", "obtener usuario por ID", error);
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

export default new UserController();