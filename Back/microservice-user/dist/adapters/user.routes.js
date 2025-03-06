"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.post("/", user_controller_1.createUserController);
router.get("/", user_controller_1.getAllUsersController);
router.get("/:id", auth_middleware_1.authenticateJWT, user_controller_1.getUserController);
router.post("/login", user_controller_1.loginUserController);
router.post("/validate", auth_middleware_1.authenticateJWT, user_controller_1.validateUserController); // ✅ Agregar esta línea
router.put("/:id", auth_middleware_1.authenticateJWT, user_controller_1.updateUserController);
router.delete("/:id", auth_middleware_1.authenticateJWT, user_controller_1.deleteUserController);
exports.default = router;
