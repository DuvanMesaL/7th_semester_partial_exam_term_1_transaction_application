import { Router } from "express";
import { sendWelcomeEmail, sendTransactionEmail, sendTransferEmail } from "../controllers/mail.controller";

const router = Router();

router.post("/send-welcome", sendWelcomeEmail);
router.post("/send-transaction", sendTransactionEmail);
router.post("/send-transfer", sendTransferEmail);

export default router;
