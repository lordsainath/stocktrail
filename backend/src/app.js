// Importing necessary modules
const express = require('express')

// logging module
const morgan = require('morgan');


const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes imports 
const authRoutes = require('./routes/auth.routes')


// test route
app.get("/", (req, res) => {
    res.send("server is running")
})


// auth routes
app.use("/api/auth", authRoutes)



// exporting the app module
module.exports = app;