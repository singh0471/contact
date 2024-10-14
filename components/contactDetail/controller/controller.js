const Logger = require("../../../util/logger.js");
const User = require("../../user/service/user.js");
const InvalidError = require("../../../error/invalidError.js");
const NotFoundError = require("../../../error/notFoundError.js");


const createContactDetails = async (req,res,next) => {
    try{
        const {userID} = req.params;
        const {contactID} = req.params;
        

        if(isNaN(userID))
            throw new InvalidError("invalid user number");
        if(isNaN(contactID))
            throw new InvalidError("invalid contact id");
        
        const {type,value} = req.body;

        if(!type || typeof type !== "string")
            throw new InvalidError("invalid type entered");

        if(!value || typeof value !== "string")
            throw new InvalidError("invalid value entered");

        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");
        
        const contactDetail =await user.createContactDetailsWithContactID(contactID,type,value);
        
        if(!contactDetail)
            throw new NotFoundError("could not create contact details");

        res.status(200).send(contactDetail);
        

    }
    catch(error){
        Logger.error(error);
    }
}

const getAllContactDetails = async (req,res,next) => {
    try{
        const {userID} = req.params;
        const {contactID} = req.params;
        

        if(isNaN(userID))
            throw new InvalidError("invalid user number");
        if(isNaN(contactID))
            throw new InvalidError("invalid contact id");

        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        const details = await user.getAllContactDetailsWithID(contactID);

        if(!details)
            throw new NotFoundError("could not found details");

        return res.status(200).send(details);


    }
    catch(error){
        next(error);
    }
}


const getContactDetailWithID = async (req,res,next) => {
    try{

        const {userID} = req.params;
        const {contactID} = req.params;
        const {id} = req.params;

        if(isNaN(userID))
            throw new InvalidError("invalid user number");
        if(isNaN(contactID))
            throw new InvalidError("invalid contact id");

        if(isNaN(id))
            throw new InvalidError("invalid contact detail id");

        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");
        
        const detail = await user.getContactDetailsWithID(contactID,id);

        if(!detail)
            throw new NotFoundError("could not found details");

        return res.status(200).send(detail);
    }
    catch(error){
        next(error);
    }
}

const deleteContactDetailWithID = async(req,res,next) => {
    try{
        const {userID} = req.params;
        const {contactID} = req.params;
        const {id} = req.params;

        if(isNaN(userID))
            throw new InvalidError("invalid user number");
        if(isNaN(contactID))
            throw new InvalidError("invalid contact id");

        if(isNaN(id))
            throw new InvalidError("invalid contact detail id");
        console.log("before")
        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");

        
        
        const isDeleted = await user.deleteContactDetailByID(contactID,id);
        console.log(isDeleted);
        if(!isDeleted)
            throw new NotFoundError("could not found details");

        return res.status(200).send(`contact detail with id ${id} has been deleted successfully`);
    }
    catch(error){
        next(error);
    }
}

const updateContactDetailByID = async(req,res,next) => {
    try{
        const {userID} = req.params;
        const {contactID} = req.params;
        const {id} = req.params;

        if(isNaN(userID))
            throw new InvalidError("invalid user number");
        if(isNaN(contactID))
            throw new InvalidError("invalid contact id");

        if(isNaN(id))
            throw new InvalidError("invalid contact detail id");
       
        const user = await User.getUserByUserID(userID);
        if(!user)
            throw NotFoundError("could not found user");


        const {parameter,value} = req.body;

        if(!parameter)
            throw new InvalidError("invalid parameter");
        if(!value)
            throw new InvalidError("invalid value");


        const isUpdated = await user.updateContactDetailByID(contactID,id,parameter,value);
        
        if(!isUpdated)
            throw new NotFoundError("could not found details");

        return res.status(200).send(`contact detail with id ${id} has been updated successfully`);
    }
    catch(error){
        next(error);
    }
}


module.exports = {createContactDetails,getAllContactDetails,getContactDetailWithID,deleteContactDetailWithID,updateContactDetailByID};