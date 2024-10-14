const ContactAppError = require("./contactAppError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends ContactAppError {
    constructor(detailedMessage) {
        super(StatusCodes.NOT_FOUND, detailedMessage, "Not Found Error", "Not Found Request");
    }
}

module.exports = NotFoundError;
