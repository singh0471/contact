const Logger = require("../../../util/logger.js");
const db = require("../../../models");
const ContactDetails = require("../../contactDetail/service/contactDetail.js");
const NotFoundError = require("../../../error/notFoundError.js");
const InvalidError = require("../../../error/invalidError.js");
class Contact{
    constructor(firstName,lastName,userId,id=null){
        this.firstName = firstName;
        this.lastName = lastName;
        this.userId = userId;
        this.id = id;
    }

    getFirstName(){
        return this.firstName;
    }

    getLastName(){
        return this.lastName;
    }

    getContactID(){
        return this.id;
    }

    static async newContact(firstName,lastName,userId){
        try{
            const contact = new Contact(firstName,lastName,userId);
            const dbResponse = await db.contacts.create(contact);
            Logger.info("dbresponse",dbResponse);
            return new Contact(dbResponse.firstName,dbResponse.lastName,dbResponse.userId,dbResponse.id);
        }
        catch(error){
            Logger.error(error);
        }
    }

    static async getContactByID(userID, contactID) {
        try {
            const contact = await db.contacts.findOne({
                where: {
                    id: contactID,
                    userId: userID
                },
                attributes: ['firstName', 'lastName'],
                include: [
                    {
                        model: db.contactDetails,
                        as: 'contactDetails',
                        attributes: ['type', 'value']  
                    }
                ]
            });
    
            if (!contact) {
                return false;
            }
    
            return contact;
        } catch (error) {
            Logger.error(error);
        }
    }
    

    static async getAllContacts(userID) {
        try {
            const contacts = await db.contacts.findAll({
                where: {
                    userId: userID  
                },
                attributes: ['firstName', 'lastName'],
                include: [
                    {
                        model: db.contactDetails,
                        as: 'contactDetails',
                        attributes: ['type', 'value'] 
                    }
                ]
            });
    
            if (!contacts || contacts.length === 0) {
                return false;   
            }
    
            return contacts;
    
        } catch (error) {
            Logger.error(error);
        }
    }
    

    static async getContact(userID,contactID){
        try{
            
            const contact = await db.contacts.findOne({
                where : {
                    id : contactID,
                    userId:userID        
                }
                
            });

            if(!contact)
                return false;

            const contactObj=  new Contact(contact.firstName,contact.lastName,contact.userId,contact.id);
            return contactObj;
        }
        catch(error){
            Logger.error(error);
        }
    }

    static async deleteContactByID(userID,contactID){
        try{
            const result = await db.contacts.destroy({
                where : {
                    id : contactID,
                    userId : userID
                }
            });

            if(result===0)
                throw new NotFoundError("could not found the contact");

            return true;
        }
        catch(error){
            Logger.error(error);
        }
    }


    static async updateContactByID(contactID,parameter,value){
        try{
            const allowedParameters = ["firstName","lastName"];

            if(!allowedParameters.includes(parameter))
                throw new InvalidError("invalid parameter entered");


            const updatedData = { [parameter]: value };

            const [updatedCount] = await db.contacts.update(updatedData, {
                where: {id:contactID}
            });

            if (updatedCount === 0) {
                throw new NotFoundError("contact not found or no update made");
            }
            
            return true;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async createContactDetailWithID(type,value){
        try{
            const newDetail = await ContactDetails.newContactDetail(type,value,this.getContactID());
            
            if(!newDetail)
                throw new NotFoundError("could not create contact details");

            return newDetail;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getAllContactDetailsWithID(contactID){
        try{
            const contactDetails = await db.contactDetails.findAll({
                where: {
                    contactId: contactID  
                },
                attributes: ['type', 'value']
            });
    
            if (!contactDetails || contactDetails.length === 0) {
                return false;   
            }
            return contactDetails;
        }
        catch(error){
            Logger.error(error);
        }
    }

    async getContactDetailsWithID(contactID,contactDetailID){
        try{
            const contactDetail = await db.contactDetails.findOne({
                where : {
                    id : contactDetailID,
                    contactId:contactID
                },
                attributes: ['type', 'value']
            });

            if(!contactDetail)
                return false;

            return contactDetail;
        }
        catch(error){
            Logger.error(error);
        }
    }

     async deleteContactDetailByID(contactID,contactDetailID){
        try{
            console.log(contactID, " " ,contactDetailID)
            const result = await db.contactDetails.destroy({
                where : {
                    id : contactDetailID,
                    contactId : contactID
                }
            });

            

            if(result===0)
                throw new NotFoundError("could not found the contact detail");

            return true;
        }
        catch(error){
            Logger.error(error);
        }
    }

     async updateContactDetailByID(contactID,contactDetailID,parameter,value){
        try{
            const allowedParameters = ["type","value"];

            if(!allowedParameters.includes(parameter))
                throw new InvalidError("invalid parameter entered");


            const updatedData = { [parameter]: value };

            const [updatedCount] = await db.contactDetails.update(updatedData, {
                where: {id:contactDetailID,contactId:contactID}
            });

            if (updatedCount === 0) {
                throw new NotFoundError("contact not found or no update made");
            }
            
            return true;
        }
        catch(error){
            Logger.error(error);
        }
    }

}


module.exports = Contact;