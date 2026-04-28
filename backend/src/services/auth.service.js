const userModel = require('../models/user.model')

 const checkEmail = async (email) => {
    const user = await userModel.findOne({ email });
    
    if(user){
        
    }

    return user ? true : false;
}

module.exports = {
    checkEmail
}