const express = require("express");
const userRouter = express.Router();
const {Payload,verifyAdmin,verifyStaff,verifyUserID} = require("../../middleware/authentication.js");
const User = require("./service/user.js");
const Logger = require("../../util/logger.js");
const {createUser,getAllUsers,getUserByID,deleteUserByID,updateUserByID} = require("./controller/controller.js");
const contactRouter = require("../contact/index.js");


userRouter.post("/",verifyAdmin,createUser);
userRouter.get("/",verifyAdmin,getAllUsers);
userRouter.get("/:id",verifyAdmin,getUserByID);
userRouter.put("/:id",updateUserByID);
userRouter.delete("/:id",verifyAdmin,deleteUserByID);



userRouter.use("/:userID/contact",verifyStaff,verifyUserID,contactRouter);

module.exports = userRouter;