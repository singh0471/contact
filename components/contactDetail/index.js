const express = require("express");
const {createContactDetails,getAllContactDetails,getContactDetailWithID,deleteContactDetailWithID,updateContactDetailByID} = require("./controller/controller.js");

const contactDetailRouter = express.Router({mergeParams:true});

contactDetailRouter.post("/",createContactDetails);
contactDetailRouter.get("/",getAllContactDetails);
contactDetailRouter.get("/:id",getContactDetailWithID);
contactDetailRouter.delete("/:id",deleteContactDetailWithID);
contactDetailRouter.put("/:id",updateContactDetailByID);
module.exports = contactDetailRouter;