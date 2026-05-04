import mongoose from "mongoose";

const panSchema = new mongoose.Schema(
    {
        panNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
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

export default mongoose.model("Pan", panSchema);
