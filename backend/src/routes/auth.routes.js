import express from "express";
import * as controller from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/check-email", controller.checkEmail);
router.post("/check-username", controller.checkUsername);
router.post("/verify-pan", controller.verifyPan);
router.post("/verify-aadhaar", controller.verifyAadhaar);
router.post("/register", controller.register);
router.post("/verify-otp", controller.verifyOTP);
router.post("/resend-otp", controller.resendOTP);

// Login Routes
router.post("/login", controller.login);
router.post("/verify-pin", controller.verifyPin);
router.post("/set-pin", controller.setPin);

// Profile Routes
router.get("/me", protect, controller.getMe);
router.put("/update-password", protect, controller.updatePassword);
router.put("/update-photo", protect, controller.updatePhoto);
router.put("/update-pin", protect, controller.updatePin);
router.post("/verify-transaction-pin", protect, controller.verifyTransactionPin);

export default router;