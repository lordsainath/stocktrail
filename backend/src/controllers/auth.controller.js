import * as service from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ValidationError } from "../utils/appError.js";

export const checkEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ValidationError("Email is required");
    }

    const result = await service.checkEmailService(email);
    res.status(200).json({ success: true, data: result });
});

export const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
        throw new ValidationError("Username is required");
    }

    const result = await service.checkUsernameService(username);
    res.status(200).json({ success: true, message: result.message, data: result });
});

export const verifyPan = asyncHandler(async (req, res) => {
    const { panNumber, holderName } = req.body;

    if (!panNumber || !holderName) {
        throw new ValidationError("PAN number and holderName are required");
    }

    const result = await service.verifyPanService(panNumber, holderName);
    res.status(200).json({ success: true, message: result.message, data: result });
});

export const verifyAadhaar = asyncHandler(async (req, res) => {
    const { aadhaarNumber, holderName } = req.body;

    if (!aadhaarNumber || !holderName) {
        throw new ValidationError("Aadhaar number and holderName are required");
    }

    const result = await service.verifyAadhaarService(aadhaarNumber, holderName);
    res.status(200).json({ success: true, message: result.message, data: result });
});

export const register = asyncHandler(async (req, res) => {
    console.log(`[CONTROLLER] Registering user: ${req.body.email}`);

    const { email, username, name, password, panNumber, aadhaarNumber, address } = req.body;

    if (!email || !username || !name || !password || !panNumber || !aadhaarNumber || !address) {
        throw new ValidationError("All fields (email, username, name, password, panNumber, aadhaarNumber, address) are required");
    }

    await service.registerService(req.body);
    res.status(201).json({
        success: true,
        message: "Registration successful. OTP has been sent to your email.",
    });
});

export const verifyOTP = asyncHandler(async (req, res) => {
    console.log(`[CONTROLLER] Verifying OTP for user: ${req.body.email}`);

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ValidationError("Email and OTP are required");
    }

    const result = await service.verifyOTPService(email, otp);
    res.status(200).json({
        success: true,
        message: result.message,
    });
});

export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ValidationError("Email is required");
    }

    await service.resendOTPService(email);
    res.status(200).json({
        success: true,
        message: "OTP has been resent to your email",
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ValidationError("Email and password are required");
    }

    const result = await service.loginService(email, password);
    res.status(200).json({
        success: true,
        message: "Login successful. Please verify your PIN",
        data: result,
    });
});

export const verifyPin = asyncHandler(async (req, res) => {
    const { tempToken, pin } = req.body;

    if (!tempToken || !pin) {
        throw new ValidationError("Temporary token and PIN are required");
    }

    const result = await service.verifyPinService(tempToken, pin);
    res.status(200).json({
        success: true,
        message: "PIN verified successfully",
        data: result,
    });
});

export const setPin = asyncHandler(async (req, res) => {
    console.log("[CONTROLLER] Setting PIN");

    const { email, pin } = req.body;

    if (!email || !pin) {
        throw new ValidationError("Email and PIN are required");
    }

    await service.setPinService(email, pin);
    res.status(200).json({
        success: true,
        message: "PIN set successfully",
    });
});

export const updatePin = asyncHandler(async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        throw new ValidationError("PIN is required");
    }

    await service.updatePinByUserIdService(req.user.id, pin);
    res.status(200).json({
        success: true,
        message: "PIN updated successfully",
    });
});

export const getMe = asyncHandler(async (req, res) => {
    const profile = await service.getProfileService(req.user.id);
    res.status(200).json({
        success: true,
        data: profile,
    });
});

export const verifyTransactionPin = asyncHandler(async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        throw new ValidationError("PIN is required");
    }

    const result = await service.verifyTransactionPinService(req.user.id, pin);
    res.status(200).json({
        success: true,
        message: result.message,
        data: result,
    });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        throw new ValidationError("New password is required");
    }

    await service.updatePasswordByUserIdService(req.user.id, password);
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

export const updatePhoto = asyncHandler(async (req, res) => {
    const { photoUrl } = req.body;

    if (!photoUrl) {
        throw new ValidationError("Photo URL is required");
    }

    const profile = await service.updatePhotoByUserIdService(req.user.id, photoUrl);
    res.status(200).json({
        success: true,
        message: "Photo updated successfully",
        data: profile,
    });
});