import express from "express";
import * as controller from "../controllers/wallet.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", protect, controller.getSummary);
router.post("/banks", protect, controller.addBankAccount);
router.post("/add-money", protect, controller.addMoney);

export default router;
