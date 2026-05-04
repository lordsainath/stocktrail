import Pan from "../models/pan.model.js";
import Aadhaar from "../models/aadhaar.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ConflictError, ValidationError } from "../utils/appError.js";
import { validatePAN, validateAadhaar } from "../utils/validation.js";

export const addPanData = asyncHandler(async (req, res) => {
    const { panNumber, holderName, isActive = true } = req.body;

    if (!panNumber || !holderName) {
        throw new ValidationError("panNumber and holderName are required");
    }

    const normalizedPan = validatePAN(panNumber);

    const existing = await Pan.findOne({ panNumber: normalizedPan });
    if (existing) {
        throw new ConflictError("PAN data already exists");
    }

    const record = await Pan.create({
        panNumber: normalizedPan,
        holderName: holderName.trim(),
        isActive,
    });

    res.status(201).json({
        success: true,
        message: "PAN data added successfully",
        data: record,
    });
});

export const addAadhaarData = asyncHandler(async (req, res) => {
    const { aadhaarNumber, holderName, isActive = true } = req.body;

    if (!aadhaarNumber || !holderName) {
        throw new ValidationError("aadhaarNumber and holderName are required");
    }

    const normalizedAadhaar = validateAadhaar(aadhaarNumber);

    const existing = await Aadhaar.findOne({ aadhaarNumber: normalizedAadhaar });
    if (existing) {
        throw new ConflictError("Aadhaar data already exists");
    }

    const record = await Aadhaar.create({
        aadhaarNumber: normalizedAadhaar,
        holderName: holderName.trim(),
        isActive,
    });

    res.status(201).json({
        success: true,
        message: "Aadhaar data added successfully",
        data: record,
    });
});

export const listPanData = asyncHandler(async (req, res) => {
    const records = await Pan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: records });
});

export const listAadhaarData = asyncHandler(async (req, res) => {
    const records = await Aadhaar.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: records });
});
