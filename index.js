const express = require("express");
const app = express();
const Logger = require("./util/logger.js");
const dotenv = require("dotenv");
const middlewareError = require("./middleware/error.js");
dotenv.config();
const PORT = process.env.PORT;
const router = require("./components");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/contact-app",router);

app.use(middlewareError);

app.listen(PORT,()=>{
    Logger.info(`port ${PORT} is running.`);
})









