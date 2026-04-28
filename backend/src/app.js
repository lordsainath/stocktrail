
const express = require('express')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Routes imports 
const authRoutes = require('./routes/auth.routes')



app.get("/",(req,res)=>{
    res.send("server is running")
})


app.use("/api/auth", authRoutes)




module.exports = app;