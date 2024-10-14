const jwt = require("jsonwebtoken");
const Logger = require("../util/logger.js");
const InvalidError = require("../error/invalidError.js");
const NotFoundError = require("../error/notFoundError.js");
const UnauthorizedError = require("../error/unauthorizedError.js");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.SECRET_KEY;


class Payload{
    constructor(userID,isAdmin){
        this.userID = userID;
        this.isAdmin = isAdmin;
    }

    static newPayload(userID,isAdmin){
        try{
            return new Payload(userID,isAdmin);
        }
        catch(error){
            Logger.error(error);
        }
    }

    signPayload(){
        try{
            return `Bearer ${jwt.sign({userID:this.userID,isAdmin:this.isAdmin},secretKey,{expiresIn:"10hr"})}`;
        }
        catch(error){
            Logger.error(error);
        }
    }

    static verifyToken(token){
        try{
            const payload = jwt.verify(token,secretKey);
            return payload;
        }
        catch(error){
            Logger.error(error);
        }
    }
}


const verifyAdmin = (req,res,next) => {
    try{
        Logger.info("verifying admin");

        if(!req.cookies["auth"] || !req.cookies["auth"])
            throw new NotFoundError("cookie not found");

        const token = req.cookies["auth"].split(" ")[2];

        const payload = Payload.verifyToken(token);
        
        if(!payload.isAdmin)
            throw new UnauthorizedError("Admin verification failed");

        Logger.info("Admin verified");
        next();
    }
    catch(error){
        next(error);
    }
}

const verifyStaff = (req,res,next) => {
    try{
        Logger.info("verifying staff");

        if(!req.cookies["auth"] || !req.cookies["auth"])
            throw new NotFoundError("cookie not found");

        const token = req.cookies["auth"].split(" ")[2];

        const payload = Payload.verifyToken(token);
        req.user = payload.userID;
        if(payload.isAdmin)
            throw new UnauthorizedError("Staff verification failed");

        Logger.info("Staff verified");
        next();
    }
    catch(error){
        next(error);
    }
}

const verifyUserID = (req,res,next) => {
    try{
        const {userID} = req.params;
        const user = req.user;
        console.log(userID," ",user)
        if(userID != user)
            throw new UnauthorizedError("you cannot access someone elses accounts.");

        next();
    }
    catch(error){
        next(error);
    }
}


module.exports = {Payload,verifyAdmin,verifyStaff,verifyUserID};