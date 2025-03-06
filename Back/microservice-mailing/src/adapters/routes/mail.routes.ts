import { Router } from "express";
import { sendMailController } from "../controllers/mail.controller";

const router = Router();

router.post("/send", sendMailController);

export default router;
