import express from "express";
import { LogController } from "../controllers/log.controller";

const router = express.Router();

router.post("/", LogController.createLog);
router.get("/logs", LogController.getAllLogs);

export default router;
