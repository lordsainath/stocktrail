
const express = require('express');
const authController = require('../controllers/auth.controller');


const authRoutes = express.Router()

// Define auth routes

// Test route
authRoutes.get("/test", authController.test)

// Check email route
authRoutes.post("/check-email", authController.checkEmail)


module.exports = authRoutes;