import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { InternalServerError } from "./appError.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error("[EMAIL] Transporter error:", error.message);
    } else {
        console.log("[EMAIL] Transporter verified successfully");
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        if (!to || !subject || !text) {
            throw new Error("Email recipient, subject, and text are required");
        }

        const mailOptions = {
            from: `Stock Terminal <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Email sent to ${to}:`, info.messageId);
        return info;
    } catch (error) {
        console.error(`[EMAIL] Failed to send email to ${to}:`, error.message);
        throw new InternalServerError(`Failed to send email: ${error.message}`);
    }
};