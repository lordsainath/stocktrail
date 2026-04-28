const dotenv = require("dotenv")
dotenv.config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const port = process.env.PORT


app.listen(port, () => {
    connectDB().then(() => {
        console.log(`Server is running on port ${port}`);
    }).catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    });

})