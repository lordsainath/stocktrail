// injecting environment variables from .env file
const dotenv = require("dotenv")
dotenv.config();


// importing necessary modules
const app = require('./src/app');
const connectDB = require('./src/config/db');



// Port configuration
const port = process.env.PORT || 5000;


// function to start the server
const startServer = async () => {
    try {

        // connect to the database
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}

// Start the server
startServer();


