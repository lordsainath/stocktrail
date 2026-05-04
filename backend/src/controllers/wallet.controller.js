import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getWalletSummaryService,
    addBankAccountService,
    addMoneyService,
} from "../services/wallet.service.js";

export const getSummary = asyncHandler(async (req, res) => {
    const summary = await getWalletSummaryService(req.user.id);
    res.status(200).json({
        success: true,
        data: summary,
    });
});

export const addBankAccount = asyncHandler(async (req, res) => {
    const bankAccount = await addBankAccountService(req.user.id, req.body);
    res.status(201).json({
        success: true,
        message: "Bank account added successfully",
        data: bankAccount,
    });
});

export const addMoney = asyncHandler(async (req, res) => {
    const result = await addMoneyService(req.user.id, req.body);
    res.status(200).json({
        success: true,
        message: "Money added to wallet successfully",
        data: result,
    });
});
