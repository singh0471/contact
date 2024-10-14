const ContactAppError = require("../error/contactAppError");
const Logger = require("../util/logger.js");

const middlewareError = (err, req, res, next) => {
    if (err instanceof ContactAppError) {
        Logger.error(err);
        return res.status(err.httpStatusCode).send(err.message);
    }

    return res.status(500).send("Bad Request");
};

module.exports = middlewareError;
