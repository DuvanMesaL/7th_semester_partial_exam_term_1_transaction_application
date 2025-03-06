import { Router } from "express";
import UserController from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  validateCreateUser,
  validateGetUserById,
  validateUpdateUser,
  validateDeleteUser
} from "../../infrastructure/validators/user.validator";

const router = Router();

// 📌 Rutas públicas (No requieren autenticación)
router.post("/", validateCreateUser, validateRequest, UserController.createUser); // Crear usuario
router.post("/login", AuthController.login); // ✅ Login de usuario

// 📌 Rutas protegidas (Requieren autenticación con JWT)
router.get("/:id", authMiddleware, validateGetUserById, validateRequest, UserController.getUserById);
router.put("/:id", authMiddleware, validateUpdateUser, validateRequest, UserController.updateUser);
router.delete("/:id", authMiddleware, validateDeleteUser, validateRequest, UserController.deleteUser);

export default router;
