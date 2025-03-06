import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { TransferController } from "../controllers/transfer.controller";

const router = Router();

// 📌 Endpoint para transferencias de saldo
router.post("/", authMiddleware, (req, res) => TransferController.transfer(req, res));

export default router;
