import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { TransactionController } from "../controllers/transaction.controller";

const router = Router();

// 📌 Rutas protegidas con autenticación JWT
router.post("/", authMiddleware, (req, res) => TransactionController.createTransaction(req, res));
router.get("/:id", authMiddleware, (req, res) => TransactionController.getTransactionById(req, res));
router.get("/account/:accountId", authMiddleware, (req, res) => TransactionController.getTransactionsByAccountId(req, res));

export default router;
