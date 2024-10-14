const  Logger  = require("../../../util/logger.js");
const User = require("../service/user.js");
const InvalidError = require("../../../error/invalidError.js");
const NotFoundError = require("../../../error/notFoundError.js");

const createUser = async (req,res,next) => {
    try{
        const {firstName,lastName,username,password} = req.body;

        if (!firstName || typeof firstName !== "string") {
            throw new InvalidError("Invalid first name");
        }
        if (!lastName || typeof lastName !== "string") {
            throw new InvalidError("Invalid last name");
        }
        if (!username || typeof username !== "string") {
            throw new InvalidError("Invalid username");
        }
        if (!password || typeof password !== "string") {
            throw new InvalidError("Invalid password");
        }

         
        const existingUser = await User.getUserByUsername(username);  
        if (existingUser) {
            throw new InvalidError("This username already exists");
        }
        
        const admin = await User.getUserByUsername("admin");
        
        
        const staff = await admin.newStaff(firstName,lastName,username,password);
        
        if(!staff)
            throw new NotFoundError("could not create staff");

        res.status(200).send(staff);
    }
    catch(error){
        next(error);
        
    }
}


const getAllUsers = async (req, res, next) => {
    try {
        const admin = await User.getUserByUsername("admin");
        const allUsers = await admin.getAllUsers();  

        
        if (!Array.isArray(allUsers) || allUsers.length === 0) {
            throw new NotFoundError("No users found");  
        }

         
        return res.status(200).send(allUsers);  
    } catch (error) {
        next(error);  
    }
};


const getUserByID = async (req,res,next) => {
    try{
        const {id} = req.params;
        
        if(isNaN(id))
            throw new InvalidError("invalid id entered");

        const admin = await User.getUserByUsername("admin");
        const user = await admin.getUserByID(id);

        if(!user)
            throw new NotFoundError("could not found the user");
        
        return res.status(200).send(user);
    }
    catch(error){
        next(error);
    }
}

const deleteUserByID = async (req,res,next) => {
    try{
        const {id} = req.params;
        if(isNaN(id))
            throw new InvalidError("invalid id entered");

        const admin = await User.getUserByUsername("admin");
        const isDeleted = await admin.deleteUserByID(id);

        if(!isDeleted)
            throw new NotFoundError("could not delete the user");

        return res.status(200).send(`user with id ${id} has been deleted successfully`);

    }
    catch(error){
        next(error);
    }
}

const updateUserByID = async (req,res,next) => {
    try{
        const {id} = req.params;
        if(isNaN(id))
            throw new InvalidError("invalid user id entered");

        const {parameter,value} = req.body;
        
        if(!parameter || typeof parameter !== "string")
            throw new InvalidError("invalid parameter entered")
        if(!value || typeof parameter !== "string")
            throw new InvalidError("invalid value entered");

        const admin = await User.getUserByUsername("admin");

        const isUpdated = await admin.updateUserByID(id,parameter,value);

        if(!isUpdated)
            throw new NotFoundError("could not update");

        return res.status(200).send(`user with id ${id} has been updated successfully`);

    }
    catch(error){
        next(error);
    }
}



module.exports = {createUser,getAllUsers,getUserByID,deleteUserByID,updateUserByID};