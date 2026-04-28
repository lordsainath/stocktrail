const authService = require('../services/auth.service')

// Check if email is already registered
const checkEmail = async (req, res) => {
    const {email} = req.body;
    
    const emailExists = await authService.checkEmail(email);

    console.log(emailExists);
    

    res.send({message: `Email ${email} is available`})
}



const test = (req, res) => {
    res.send("Auth controller is working")
}

module.exports = {
    test,
    checkEmail
}