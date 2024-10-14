const express = require("express");

const contactRouter = express.Router({mergeParams:true});
const {createContact,getAllContacts,getContactByID,deleteContactByID,updateContactByID} = require("./controller/controller.js");
const contactDetailRouter = require("../contactDetail/index.js");

contactRouter.post("/",createContact);
contactRouter.get("/",getAllContacts);
contactRouter.get("/:id",getContactByID);
contactRouter.delete("/:id",deleteContactByID);
contactRouter.put("/:id",updateContactByID);

contactRouter.use("/:contactID/contactDetail",contactDetailRouter);
module.exports = contactRouter;