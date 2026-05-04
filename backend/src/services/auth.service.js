import User from "../models/user.model.js";
import Pan from "../models/pan.model.js";
import Aadhaar from "../models/aadhaar.model.js";
import { hashData, compareData } from "../utils/hash.js";
import { generateOTP } from "../utils/otp.js";
import { sendEmail } from "../utils/mail.js";
import { generateToken, verifyToken } from "../utils/token.js";
import {
    validateEmail,
    validatePassword,
    validateOTP,
    validatePIN,
    validateUsername,
    validatePAN,
    validateAadhaar,
    validateName,
    validateAddress,
    validateRequiredFields,
} from "../utils/validation.js";
import {
    ConflictError,
    NotFoundError,
    AuthenticationError,
    ValidationError,
} from "../utils/appError.js";

const normalizeFullName = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

const getSafeUserPayload = (user) => ({
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    photoUrl: user.photoUrl,
    panNumber: user.panNumber,
    aadhaarNumber: user.aadhaarNumber,
    address: user.address,
    isPinSet: user.isPinSet,
    kycStatus: user.kycStatus,
    wallet: user.wallet,
});

export const checkEmailService = async (email) => {
    
    try {
        validateEmail(email);
        const user = await User.findOne({ email });

        if (!user) return { status: "NEW_USER" };
        if (!user.isVerified) return { status: "NOT_VERIFIED" };
        if (!user.isPinSet) return { status: "NO_PIN" };

        return { status: "READY_TO_LOGIN" };
    } catch (error) {
        console.error(`[AUTH-SERVICE] Error checking email:`, error.message);
        throw error;
    }
};

export const checkUsernameService = async (username) => {
    const normalized = validateUsername(username).toLowerCase();
    const existing = await User.findOne({ username: normalized });

    return {
        available: !existing,
        message: existing ? "Username is already taken" : "Username is available",
    };
};

export const verifyPanService = async (panNumber, holderName) => {
    const normalized = validatePAN(panNumber);
    validateName(holderName);

    const panRecord = await Pan.findOne({ panNumber: normalized, isActive: true });
    if (!panRecord) {
        throw new ValidationError("PAN not found in verification records");
    }

    if (normalizeFullName(panRecord.holderName) !== normalizeFullName(holderName)) {
        throw new ValidationError("PAN holder name does not match entered full name");
    }

    const existing = await User.findOne({ panNumber: normalized });
    if (existing) {
        throw new ConflictError("PAN is already linked to another account");
    }

    return {
        valid: true,
        panNumber: normalized,
        message: "PAN verified successfully",
    };
};

export const verifyAadhaarService = async (aadhaarNumber, holderName) => {
    const normalized = validateAadhaar(aadhaarNumber);
    validateName(holderName);

    const aadhaarRecord = await Aadhaar.findOne({ aadhaarNumber: normalized, isActive: true });
    if (!aadhaarRecord) {
        throw new ValidationError("Aadhaar not found in verification records");
    }

    if (normalizeFullName(aadhaarRecord.holderName) !== normalizeFullName(holderName)) {
        throw new ValidationError("Aadhaar holder name does not match entered full name");
    }

    const existing = await User.findOne({ aadhaarNumber: normalized });
    if (existing) {
        throw new ConflictError("Aadhaar is already linked to another account");
    }

    return {
        valid: true,
        aadhaarNumber: normalized,
        message: "Aadhaar verified successfully",
    };
};

export const registerService = async (data) => {

    try {
        const { email, username, name, password, panNumber, aadhaarNumber, address } = data;

        validateRequiredFields(data, ["email", "username", "name", "password", "panNumber", "aadhaarNumber", "address"]);
        validateEmail(email);
        const normalizedUsername = validateUsername(username).toLowerCase();
        validateName(name);
        validatePassword(password);
        const normalizedPan = validatePAN(panNumber);
        const normalizedAadhaar = validateAadhaar(aadhaarNumber);
        const normalizedAddress = validateAddress(address);

        const [panRecord, aadhaarRecord] = await Promise.all([
            Pan.findOne({ panNumber: normalizedPan, isActive: true }),
            Aadhaar.findOne({ aadhaarNumber: normalizedAadhaar, isActive: true }),
        ]);

        if (!panRecord) {
            throw new ValidationError("PAN not found in verification records");
        }

        if (!aadhaarRecord) {
            throw new ValidationError("Aadhaar not found in verification records");
        }

        const normalizedName = normalizeFullName(name);
        if (normalizeFullName(panRecord.holderName) !== normalizedName) {
            throw new ValidationError("PAN holder name does not match entered full name");
        }

        if (normalizeFullName(aadhaarRecord.holderName) !== normalizedName) {
            throw new ValidationError("Aadhaar holder name does not match entered full name");
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username: normalizedUsername },
                { panNumber: normalizedPan },
                { aadhaarNumber: normalizedAadhaar },
            ],
        });

        if (existingUser) {
            let field = "User data";
            if (existingUser.email === email) field = "Email";
            else if (existingUser.username === normalizedUsername) field = "Username";
            else if (existingUser.panNumber === normalizedPan) field = "PAN";
            else if (existingUser.aadhaarNumber === normalizedAadhaar) field = "Aadhaar";

            throw new ConflictError(`${field} already registered`);
        }

        const hashed = await hashData(password);
        const otp = generateOTP();

        const user = await User.create({
            email,
            username: normalizedUsername,
            name,
            password: hashed,
            panNumber: normalizedPan,
            aadhaarNumber: normalizedAadhaar,
            address: normalizedAddress,
            kycStatus: "VERIFIED",
            otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        });
``
        console.log(`[AUTH-SERVICE] User created, sending OTP to ${email}`);
        await sendEmail(email, "OTP Verification", `<h2>Your OTP is <strong>${otp}</strong></h2><p>This OTP will expire in 10 minutes.</p>`);

        return user;
    } catch (error) {
        console.error(`[AUTH-SERVICE] Registration error:`, error.message);
        throw error;
    }
};

export const verifyOTPService = async (email, otp) => {
    try {
        validateEmail(email);
        validateOTP(otp);

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User");
        }

        if (user.isVerified) {
            throw new ValidationError("User is already verified");
        }

        if (user.otp !== otp) {
            throw new AuthenticationError("Invalid OTP");
        }

        if (new Date() > user.otpExpiry) {
            throw new AuthenticationError("OTP has expired");
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();
        console.log(`[AUTH-SERVICE] OTP verified for ${email}`);

        return { message: "Verified successfully" };
    } catch (error) {
        console.error(`[AUTH-SERVICE] OTP verification error:`, error.message);
        throw error;
    }
};

export const resendOTPService = async (email) => {
    console.log(`[AUTH-SERVICE] Resending OTP to: ${email}`);

    try {
        validateEmail(email);

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User");
        }

        if (user.isVerified) {
            throw new ValidationError("User is already verified");
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();
        console.log(`[AUTH-SERVICE] OTP resent to ${email}`);

        await sendEmail(email, "OTP Resend", `<h2>Your new OTP is <strong>${otp}</strong></h2><p>This OTP will expire in 10 minutes.</p>`);
    } catch (error) {
        console.error(`[AUTH-SERVICE] Resend OTP error:`, error.message);
        throw error;
    }
};

export const loginService = async (email, password) => {
    console.log(`[AUTH-SERVICE] Login attempt for: ${email}`);

    try {
        validateEmail(email);
        validateRequiredFields({ email, password }, ["email", "password"]);

        const user = await User.findOne({ email });

        if (!user) {
            throw new AuthenticationError("Invalid email or password");
        }

        if (!user.isVerified) {
            throw new ValidationError("Please verify your email first");
        }

        const isMatch = await compareData(password, user.password);

        if (!isMatch) {
            throw new AuthenticationError("Invalid email or password");
        }

        const tempToken = generateToken({ id: user._id }, "5m");
        console.log(`[AUTH-SERVICE] Temp token generated for ${email}`);

        return { tempToken };
    } catch (error) {
        console.error(`[AUTH-SERVICE] Login error:`, error.message);
        throw error;
    }
};

export const verifyPinService = async (tempToken, pin) => {
    console.log(`[AUTH-SERVICE] Verifying PIN`);

    try {
        validatePIN(pin);
        validateRequiredFields({ tempToken, pin }, ["tempToken", "pin"]);

        let decoded;
        try {
            decoded = verifyToken(tempToken);
        } catch (error) {
            throw new AuthenticationError(error.message);
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.isPinSet) {
            throw new ValidationError("Please set a PIN first");
        }

        const isMatch = await compareData(pin, user.pin);

        if (!isMatch) {
            throw new AuthenticationError("Invalid PIN");
        }

        const token = generateToken({ id: user._id }, "7d");
        console.log(`[AUTH-SERVICE] PIN verified, token generated for ${user.email}`);

        return { token, user: getSafeUserPayload(user) };
    } catch (error) {
        console.error(`[AUTH-SERVICE] PIN verification error:`, error.message);
        throw error;
    }
};

export const setPinService = async (email, pin) => {
    console.log(`[AUTH-SERVICE] Setting PIN for: ${email}`);

    try {
        validateEmail(email);
        validatePIN(pin);

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User");
        }

        if (!user.isVerified) {
            throw new ValidationError("Please verify your email first");
        }

        user.pin = await hashData(pin);
        user.isPinSet = true;

        await user.save();
        console.log(`[AUTH-SERVICE] PIN set for ${email}`);
    } catch (error) {
        console.error(`[AUTH-SERVICE] Set PIN error:`, error.message);
        throw error;
    }
};

export const updatePasswordService = async (email, password) => {
    console.log(`[AUTH-SERVICE] Updating password for: ${email}`);

    try {
        validateEmail(email);
        validatePassword(password);

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User");
        }

        user.password = await hashData(password);
        await user.save();
        console.log(`[AUTH-SERVICE] Password updated for ${email}`);
    } catch (error) {
        console.error(`[AUTH-SERVICE] Update password error:`, error.message);
        throw error;
    }
};

export const updatePhotoService = async (email, photoUrl) => {
    console.log(`[AUTH-SERVICE] Updating photo for: ${email}`);

    try {
        validateEmail(email);
        validateRequiredFields({ photoUrl }, ["photoUrl"]);

        if (typeof photoUrl !== "string" || !photoUrl.trim()) {
            throw new ValidationError("Invalid photo URL");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User");
        }

        user.photoUrl = photoUrl;
        await user.save();
        console.log(`[AUTH-SERVICE] Photo updated for ${email}`);
    } catch (error) {
        console.error(`[AUTH-SERVICE] Update photo error:`, error.message);
        throw error;
    }
};

export const getProfileService = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError("User");
    }

    return getSafeUserPayload(user);
};

export const updatePasswordByUserIdService = async (userId, password) => {
    validatePassword(password);

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }

    user.password = await hashData(password);
    await user.save();
};

export const updatePhotoByUserIdService = async (userId, photoUrl) => {
    validateRequiredFields({ photoUrl }, ["photoUrl"]);

    if (typeof photoUrl !== "string" || !photoUrl.trim()) {
        throw new ValidationError("Invalid photo URL");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }

    user.photoUrl = photoUrl.trim();
    await user.save();

    return getSafeUserPayload(user);
};

export const updatePinByUserIdService = async (userId, pin) => {
    validatePIN(pin);

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }

    user.pin = await hashData(pin);
    user.isPinSet = true;
    await user.save();
};

export const verifyTransactionPinService = async (userId, pin) => {
    validatePIN(pin);

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }

    if (!user.isPinSet || !user.pin) {
        throw new ValidationError("Please set your PIN first");
    }

    const isMatch = await compareData(pin, user.pin);
    if (!isMatch) {
        throw new AuthenticationError("Invalid PIN");
    }

    return { verified: true, message: "PIN verified for transaction" };
};