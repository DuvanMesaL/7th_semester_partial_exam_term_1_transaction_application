import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { AccountController  } from "../controllers/account.controller";

const router = Router();

router.post("/", (req, res) => AccountController.createAccount(req, res));
router.get("/:id", authMiddleware, (req, res) => AccountController.getAccountById(req, res));
router.get("/user/:userId", authMiddleware, (req, res) => AccountController.getAccountByUserId(req, res));
router.get("/number/:number", authMiddleware, (req, res) => AccountController.getAccountByNumber(req, res));

export default router;
