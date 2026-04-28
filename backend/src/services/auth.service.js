const userModel = require('../models/user.model')


// Check if email is already registered
const checkEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email });

        if (!user) return { status: "NEW_USER" };
        if (!user.isVerified) return { status: "NOT_VERIFIED" };
        if (!user.isPinSet) return { status: "NO_PIN" };

        return { status: "READY_TO_LOGIN" }
    } catch (error) {
        console.error("Error checking email:", error);
        throw new Error("Internal Server Error");
    }

}

module.exports = {
    checkEmail
}