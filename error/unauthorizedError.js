const ContactAppError = require("./contactAppError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends ContactAppError {
    constructor(detailedMessage) {
        super(StatusCodes.UNAUTHORIZED, detailedMessage, "Unauthorized Error", "Unauthorized Request");
    }
}

module.exports = UnauthorizedError;
