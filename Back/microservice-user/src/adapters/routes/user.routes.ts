import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/", UserController.createUser); // Crear usuario
router.post("/login", AuthController.login); // ✅ Ahora usa AuthController

// 📌 Rutas protegidas (Requieren autenticación con JWT)
router.get("/:id", authMiddleware, UserController.getUserById);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
