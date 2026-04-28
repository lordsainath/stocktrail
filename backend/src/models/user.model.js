const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: String,
    },
    isVerified: { type: Boolean, default: false },
    isPinSet: { type: Boolean, default: false },
    panNumber: {
        type: String,
        uppercase: true,
        trim: true,
    },
    aadharNumber: {
        type: String,
        trim: true,
    },
    otp: String,
    otpExpiry: Date
}, { timestamps: true })

const user = mongoose.model("User", userSchema)


module.exports = user;