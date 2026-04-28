
const express = require('express');
const authController = require('../controllers/auth.controller');


const authRoutes = express.Router()

// Define auth routes



// Authentication Routes
authRoutes.post("/check-email", authController.checkEmail)



module.exports = authRoutes;