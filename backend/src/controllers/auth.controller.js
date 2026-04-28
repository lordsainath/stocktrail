const authService = require('../services/auth.service')

// Check if email is already registered
const checkEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }
    const result = await authService.checkEmail(email)
    res.status(200).json({ success: true, data: result })
}





module.exports = {

    checkEmail
}