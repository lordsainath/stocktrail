import User from "../models/user.model.js";
import { compareData } from "../utils/hash.js";
import { NotFoundError, ValidationError, AuthenticationError } from "../utils/appError.js";

const sanitizeAmount = (amount) => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new ValidationError("Amount must be a valid positive number");
    }

    // Round to 2 decimals to avoid floating drift for display-level wallet amounts.
    return Math.round(parsed * 100) / 100;
};

const getUserOrThrow = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }
    return user;
};

const getSafeWalletSummary = (user) => ({
    balance: user.wallet?.balance || 0,
    bankAccounts: user.bankAccounts || [],
    transactions: user.wallet?.transactions || [],
});

export const getWalletSummaryService = async (userId) => {
    const user = await getUserOrThrow(userId);
    return getSafeWalletSummary(user);
};

export const addBankAccountService = async (userId, payload) => {
    const {
        bankName,
        accountHolder,
        accountNumber,
        ifsc,
        accountType = "Savings",
    } = payload;

    if (!bankName || !accountHolder || !accountNumber || !ifsc) {
        throw new ValidationError("bankName, accountHolder, accountNumber and ifsc are required");
    }

    const normalizedAccountNumber = String(accountNumber).replace(/\s+/g, "").trim();
    if (!/^\d{8,18}$/.test(normalizedAccountNumber)) {
        throw new ValidationError("Account number must be between 8 and 18 digits");
    }

    const normalizedIfsc = String(ifsc).toUpperCase().trim();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(normalizedIfsc)) {
        throw new ValidationError("Invalid IFSC format");
    }

    const user = await getUserOrThrow(userId);
    user.bankAccounts = user.bankAccounts || [];

    const duplicate = user.bankAccounts.find((item) => item.accountNumber === normalizedAccountNumber);
    if (duplicate) {
        throw new ValidationError("This bank account is already added");
    }

    user.bankAccounts.push({
        bankName: String(bankName).trim(),
        accountHolder: String(accountHolder).trim(),
        accountNumber: normalizedAccountNumber,
        ifsc: normalizedIfsc,
        accountType: String(accountType).trim() || "Savings",
        status: user.bankAccounts.length === 0 ? "VERIFIED" : "PENDING",
    });

    await user.save();

    return user.bankAccounts[user.bankAccounts.length - 1];
};

export const addMoneyService = async (userId, payload) => {
    const { amount, pin, bankAccountId } = payload;

    if (!pin) {
        throw new ValidationError("PIN is required");
    }

    if (!/^\d{4}$/.test(String(pin))) {
        throw new ValidationError("PIN must be exactly 4 digits");
    }

    const normalizedAmount = sanitizeAmount(amount);

    const user = await getUserOrThrow(userId);

    if (!user.isPinSet || !user.pin) {
        throw new ValidationError("Please set your PIN first");
    }

    const isPinValid = await compareData(String(pin), user.pin);
    if (!isPinValid) {
        throw new AuthenticationError("Invalid PIN");
    }

    user.bankAccounts = user.bankAccounts || [];

    let sourceBank = null;
    if (bankAccountId) {
        sourceBank = user.bankAccounts.find((item) => String(item._id) === String(bankAccountId));
        if (!sourceBank) {
            throw new ValidationError("Selected bank account not found");
        }
    }

    if (!user.wallet) {
        user.wallet = { balance: 0, transactions: [] };
    }

    user.wallet.balance = (user.wallet.balance || 0) + normalizedAmount;

    user.wallet.transactions = user.wallet.transactions || [];
    user.wallet.transactions.unshift({
        type: "CREDIT",
        amount: normalizedAmount,
        status: "SUCCESS",
        reference: sourceBank ? `Top-up via ${sourceBank.bankName}` : "Wallet top-up",
        bankAccountId: sourceBank ? sourceBank._id : null,
        createdAt: new Date(),
    });

    await user.save();

    return {
        balance: user.wallet.balance,
        transaction: user.wallet.transactions[0],
    };
};
