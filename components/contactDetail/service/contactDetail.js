const Logger = require("../../../util/logger.js");
const db = require("../../../models");
const InvalidError = require("../../../error/invalidError.js");

class ContactDetails{
    constructor(type,value,contactId,id=null){
        this.type = type;
        this.value = value;
        this.contactId = contactId;
        this.id = id;
    }

    getType(){
        return this.type;
    }

    getValue(){
        return this.value;
    }

    getID(){
        return this.id;
    }


    static async newContactDetail(type,value,contactId){
        try{
            if(type!== "number" && type !=="email")
                throw new InvalidError("invalid type");

            const contactDetail = new ContactDetails(type,value,contactId);
            const dbResponse = await db.contactDetails.create(contactDetail);
            Logger.info("dbresponse",dbResponse);
            return new ContactDetails(dbResponse.type,dbResponse.value,dbResponse.contactId,dbResponse.id);
        }
        catch(error){
            Logger.error(error);
        }
    }

    


}

module.exports = ContactDetails;