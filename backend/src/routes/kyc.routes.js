import express from "express";
import * as kycController from "../controllers/kyc.controller.js";

const router = express.Router();

router.post("/pan", kycController.addPanData);
router.get("/pan", kycController.listPanData);

router.post("/aadhaar", kycController.addAadhaarData);
router.get("/aadhaar", kycController.listAadhaarData);

export default router;
