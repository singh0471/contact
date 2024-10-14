const ContactAppError = require("./contactAppError");
const { StatusCodes } = require("http-status-codes");

class InvalidError extends ContactAppError {
    constructor(detailedMessage) {
        super(StatusCodes.BAD_REQUEST, detailedMessage, "Invalid Error", "Invalid Request");
    }
}

module.exports = InvalidError;
