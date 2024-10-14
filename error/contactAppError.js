const Logger = require("../util/logger.js");

class ContactAppError extends Error {
    constructor(httpStatusCode, detailedMessage, type, message) {
        super(detailedMessage);   
        this.httpStatusCode = httpStatusCode;
        this.type = type;       
        this.message = message;   
    }
}

module.exports = ContactAppError;
    
