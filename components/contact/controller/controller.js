const Logger = require("../../../util/logger.js");
const User = require("../../user/service/user.js");
const InvalidError = require("../../../error/invalidError.js");
const NotFoundError = require("../../../error/notFoundError.js");

const createContact = async (req,res,next) => {
    try{
        const {userID} = req.params;

        const{firstName,lastName} = req.body;

        if(isNaN(userID))
            throw new InvalidError("invalid user id");

        if(!firstName || typeof firstName !== "string")
            throw new InvalidError("invalid first name");
        if(!lastName || typeof lastName !== "string")
            throw new InvalidError("invalid last name");

        const user = await User.getUserByUserID(userID);

        if(!user)
            throw NotFoundError("could not found user");

        const contact = await user.createContact(firstName,lastName);

        if(!contact)
            throw new NotFoundError("could not create contact");
        
        res.status(200).send(contact);

    }
    catch(error){
        next(error);
    }
}


const getAllContacts = async(req,res,next) => {
    try{
        const {userID} = req.params;
    
         
        if(isNaN(userID))
            throw new InvalidError("invalid user id");

        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        const contacts = await user.getAllContacts();

        if(!contacts)
            throw new NotFoundError("could not found contacts");

        return res.status(200).send(contacts);
    }
    catch(error){
        next(error);
    }
}

const getContactByID = async(req,res,next) => {
    try{
        const {userID} = req.params;
        const {id} = req.params;
         
        if(isNaN(userID))
            throw new InvalidError("invalid user id");
        if(isNaN(id))
            throw new InvalidError("invalid contact id");


        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        const contact = await user.getContactByID(id);

        if(!contact)
            throw new NotFoundError("could not found contacts");

        return res.status(200).send(contact);
    }
    catch(error){
        next(error);
    }
}

const deleteContactByID = async(req,res,next) => {
    try{
        const {userID} = req.params;
        const {id} = req.params;
         
        if(isNaN(userID))
            throw new InvalidError("invalid user id");
        if(isNaN(id))
            throw new InvalidError("invalid contact id");


        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        const isDeleted = user.deleteContactByID(id);

        if(!isDeleted)
            throw new NotFoundError("could not delete contact");

        return res.status(200).send(`contact with id ${id} has been deleted successfully`);
    }
    catch(error){
        next();
    }
}

const updateContactByID = async (req,res,next) => {
    try{
        const {userID} = req.params;
        const {id} = req.params;
         

        if(isNaN(userID))
            throw new InvalidError("invalid user id");
        if(isNaN(id))
            throw new InvalidError("invalid contact id");

        const {parameter,value} = req.body;

        if(!parameter || typeof parameter !== "string")
            throw new InvalidError("invalid parameter");
        if(!value || typeof value !== "string")
            throw new InvalidError("invalid value");


        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        const isUpdated = await user.updateContactByID(id,parameter,value);

        if(!isUpdated)
            throw new NotFoundError("could not update the user");

        return res.status(200).send(`contact with id ${id} has been updated successfully`);
    }
    catch(error){
        next(error);
    }
}

module.exports = {createContact,getAllContacts,getContactByID,deleteContactByID,updateContactByID};