import { ValidationError } from "./appError.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const validateEmail = (email) => {
    if (!email || !emailRegex.test(email)) {
        throw new ValidationError("Invalid email format");
    }
    return email;
};

export const validatePassword = (password) => {
    if (!password) {
        throw new ValidationError("Password is required");
    }
    if (password.length < 8) {
        throw new ValidationError("Password must be at least 8 characters");
    }

    return password;
};

export const validateOTP = (otp) => {
    if (!otp || !/^\d{6}$/.test(otp)) {
        throw new ValidationError("OTP must be a 6-digit number");
    }
    return otp;
};

export const validatePIN = (pin) => {
    if (!pin || !/^\d{4}$/.test(pin)) {
        throw new ValidationError("PIN must be a 4-digit number");
    }
    return pin;
};

export const validateUsername = (username) => {
    if (!username || username.length < 3) {
        throw new ValidationError("Username must be at least 3 characters");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new ValidationError("Username can only contain letters, numbers, and underscores");
    }
    return username;
};

export const validatePAN = (panNumber) => {
    if (!panNumber) {
        throw new ValidationError("PAN number is required");
    }

    const normalized = panNumber.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalized)) {
        throw new ValidationError("PAN format is invalid");
    }

    return normalized;
};

export const validateAadhaar = (aadhaarNumber) => {
    if (!aadhaarNumber) {
        throw new ValidationError("Aadhaar number is required");
    }

    const normalized = String(aadhaarNumber).replace(/\s|-/g, "");
    if (!/^\d{12}$/.test(normalized)) {
        throw new ValidationError("Aadhaar must be a 12-digit number");
    }

    return normalized;
};

export const validateName = (name) => {
    if (!name || name.length < 2) {
        throw new ValidationError("Name must be at least 2 characters");
    }
    return name;
};

export const validateAddress = (address) => {
    if (!address || typeof address !== "object") {
        throw new ValidationError("Address is required");
    }

    const line1 = String(address.line1 || "").trim();
    const city = String(address.city || "").trim();
    const state = String(address.state || "").trim();
    const country = String(address.country || "").trim();
    const pincode = String(address.pincode || "").trim();

    if (!line1 || !city || !state || !country) {
        throw new ValidationError("Address fields line1, city, state, and country are required");
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
        throw new ValidationError("Pincode must be a 6-digit number");
    }

    return {
        line1,
        city,
        state,
        country,
        pincode,
    };
};

export const validatePhotoUrl = (photoUrl) => {
    if (!photoUrl || typeof photoUrl !== "string") {
        throw new ValidationError("Invalid photo URL");
    }
    try {
        new URL(photoUrl);
    } catch (e) {
        throw new ValidationError("Photo URL must be a valid URL");
    }
    return photoUrl;
};

export const validateRequiredFields = (data, requiredFields) => {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
        throw new ValidationError(`Missing required fields: ${missing.join(", ")}`);
    }
};
