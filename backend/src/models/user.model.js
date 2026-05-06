import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    name: { type: String },

    password: { type: String, required: true },
    pin: { type: String },

    photoUrl: { type: String  , 
       default : 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
    },

    panNumber: { type: String, uppercase: true, trim: true },
    aadhaarNumber: { type: String, trim: true },
    address: {
      line1: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    kycStatus: {
      type: String,
      enum: ["NOT_SUBMITTED", "PENDING", "VERIFIED", "REJECTED"],
      default: "NOT_SUBMITTED"
    },

    isVerified: { type: Boolean, default: false },
    isPinSet: { type: Boolean, default: false },

    bankAccounts: [
      {
        bankName: { type: String, trim: true },
        accountHolder: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        ifsc: { type: String, uppercase: true, trim: true },
        accountType: { type: String, trim: true, default: "Savings" },
        status: {
          type: String,
          enum: ["PENDING", "VERIFIED", "REJECTED"],
          default: "PENDING"
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [
        {
          type: { type: String, enum: ["CREDIT", "DEBIT"], default: "CREDIT" },
          amount: { type: Number, default: 0 },
          status: { type: String, enum: ["SUCCESS", "FAILED", "PENDING"], default: "SUCCESS" },
          reference: { type: String, trim: true },
          bankAccountId: { type: mongoose.Schema.Types.ObjectId },
          createdAt: { type: Date, default: Date.now }
        }
      ]
    },

    otp: String,
    otpExpiry: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);