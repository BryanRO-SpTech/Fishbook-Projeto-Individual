const appError = require("../errors/appError.js");
const userModel = require("../models/user.model.js");
const CryptoJS = require("crypto-js");

const authMiddleware = async (req, res, next) => {
    const { session } = req.signedCookies;

    try {
        if (!session) {
            return res.status(401).redirect("/login")
        }

        const sessionDecrypt = JSON.parse(CryptoJS.AES.decrypt(session, process.env.CRYPTO_SECRET).toString(CryptoJS.enc.Utf8));

        req.session = sessionDecrypt;

        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware