const Logger = require("../../../util/logger.js");
const db = require("../../../models");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../../error/notFoundError.js");
const InvalidError = require("../../../error/invalidError.js");
const Contact = require("../../contact/service/contact.js");
class User{

    constructor(firstName,lastName,username,password,isAdmin,id=null){
        this.firstName=firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
        this.id = id;
        
    }

    getUserID(){
        return this.id; }

    
    getFirstName(){
        return this.firstName;
    }

    getLastName(){
        return this.lastName;
    }

    getUsername(){
        return this.username;
    }

    getPassword(){
        return this.password;
    }

    getIsAdmin(){
        return this.isAdmin;
    }

    static async getUserByUsername(username){
        try{
            const user = await db.users.findOne({
                where : {
                    username : username
                }
            });

            if(!user)
                return false;


            return new User(user.firstName,user.lastName,user.username,user.password,user.isAdmin,user.id);
        }
        catch(error){
            Logger.error(error);
        }
    }

    static async getUserByUserID(userID){
        try{
            const user = await db.users.findOne({
                where : {
                    id : userID
                }
            });

            if(!user)
                return false;


            return new User(user.firstName,user.lastName,user.username,user.password,user.isAdmin,user.id);
        }
        catch(error){
            Logger.error(error);
        }
    }
    

    static async newAdmin(firstName,lastName,username,password){
        try{
            const hashedPassword = await bcrypt.hash(password,10);
            const admin = new User(firstName,lastName,username,hashedPassword,true);
            const dbResponse = await db.users.create(admin);
            Logger.info("dbResponse>>>",dbResponse);
            return new User(dbResponse.firstName,dbResponse.lastName,dbResponse.username,dbResponse.password,dbResponse.isAdmin,dbResponse.id);
        }
        catch(error){
            Logger.error(error);
        }
    }

    async newStaff(firstName,lastName,username,password){
        try{
            const hashedPassword = await bcrypt.hash(password,10);
            const staff = new User(firstName,lastName,username,hashedPassword,false);
            const dbResponse = await db.users.create(staff);
            Logger.info("dbResponse>>>",dbResponse);
            return new User(dbResponse.firstName,dbResponse.lastName,dbResponse.username,dbResponse.password,dbResponse.isAdmin,dbResponse.id);
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getAllUsers(){
        try{
            const allUsers = await db.users.findAll();
            const staffUsers = allUsers.filter(user => !user.isAdmin).map(user => ({username : user.username,firstName:user.firstName,lastName:user.lastName}));
            return staffUsers;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getUserByID(userID){
        try{
            const user = await db.users.findOne({
                where : {
                    id : userID,
                    is_admin : false,
                },
                attributes : ["firstName","lastName","username"]
            });
            if(!user)
                throw new NotFoundError("could not found user");
            return user;
        }
        catch(error){
            Logger.error(error);
        }
    }


    async updateUserByID(userID,parameter,value){
        try{
            const allowedParameters = ["firstName","lastName","username"];

            if(!allowedParameters.includes(parameter))
                throw new InvalidError("invalid parameter entered");

            if(parameter === "username"){
                const user = await User.getUserByUsername(value);
                if(user)
                    throw new InvalidError("this username already exists");

            }

            const updatedData = { [parameter]: value };

            const [updatedCount] = await db.users.update(updatedData, {
                where: { id: userID }
            });

            if (updatedCount === 0) {
                throw new NotFoundError("User not found or no update made");
            }
            
            return true;

        }
        catch(error){
            Logger.error(error);
        }
    }

    async deleteUserByID(userID){
        try{
            const result = await db.users.destroy({
                where : {
                    id : userID,
                    is_admin : false
                }
            });

            if(result===0)
                throw new NotFoundError("could not found the user");

            return true;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async createContact(firstName,lastName){
        try{
            const contact = Contact.newContact(firstName,lastName,this.getUserID());

            if(!contact)
                throw new NotFoundError("could not create user");

            return contact;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getAllContacts(){
        try{
            const contacts = await Contact.getAllContacts(this.getUserID());
            return contacts;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getContactByID(contactID){
        try{
            const contact = await Contact.getContactByID(this.getUserID(),contactID);

            return contact;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async deleteContactByID(contactID){
        try{
            return Contact.deleteContactByID(this.getUserID(),contactID);
        }
        catch(error){
            Logger.error(error);
        }
    }

    async updateContactByID(contactID,parameter,value){
        try{
            return Contact.updateContactByID(contactID,parameter,value);
        }
        catch(error){
            Logger.error(error);
        }
    }
}

module.exports = User;