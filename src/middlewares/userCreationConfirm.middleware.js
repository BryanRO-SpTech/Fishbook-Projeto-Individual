const appError = require("../errors/appError.js");

const userCreationConfirm = async (req, res, next) => {
    const { userCreationConfirm } = req.signedCookies;

    try {
        if (!userCreationConfirm) {
            throw appError("User creation confirmation not found", 401);
        }

        req.userCreationConfirm = JSON.parse(userCreationConfirm);

        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = userCreationConfirm;