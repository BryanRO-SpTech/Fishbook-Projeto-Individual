const userModel = require("../models/user.model.js");
const userDto = require("../dtos/user.dto.js");
const appError = require("../errors/appError.js");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const { signedCookie } = require("cookie-parser");

const createUser = async (req, res, next) => {
    const { name, email, username, password, bio } = req.body;

    try {
        const validations = userDto.createDto({ name, email, username, password, bio });

        if (!validations.isValid) {
            throw appError(validations.errors, 400);
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await userModel.create({ name, email, username, password: hash, bio });

        if (result && result.isAppError || result instanceof Error) {
            throw result;
        }

        return res.status(201).json({ message: "User created successfully", user: { name, email, username, bio } });
    } catch (error) {
        next(error);
    }
}


const auth = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getByEmail(email);

        if (!user || !password) {
            throw appError("Incorrect username or password", 400);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw appError("Incorrect username or password", 400);
        }

        const token = CryptoJS.AES.encrypt(JSON.stringify({
            id: user.idUser,
            email: user.email,
            username: user.username
        }), process.env.CRYPTO_SECRET).toString();

        res.cookie("access_token", token, {
            httpOnly: true,
            signedCookie: true,
            maxAge: 1 * 1000 * 60 * 60 * 24
        }).json({ message: "User authenticated successfully", user: { userId: user.idUser, name: user.name, email: user.email, username: user.username } });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    auth
};