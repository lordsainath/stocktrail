import mongoose from "mongoose";

const aadhaarSchema = new mongoose.Schema(
    {
        aadhaarNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        holderName: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Aadhaar", aadhaarSchema);
