const database = require("../database/config.js");
const appError = require("../errors/appError.js");

const create = async ({ name, email, username, password, bio }) => {
    try {
        const [user] = await database.execute("SELECT username, email FROM User WHERE username = ? || email = ? ", [username, email]);

        if (user.email === email) {
            throw appError("Email already in use", 400);
        }

        if (user.username === username) {
            throw appError("Username already in use", 400);
        }

        const result = await database.execute(
            "INSERT INTO User (name, email, username, password, bio) VALUES (?, ?, ?, ?, ?)",
            [name, email, username, password, bio]
        );

        return result;
    } catch (error) {
        return error;
    }
}

const updateProfilePhoto = async (idUser, photoPath) => {
    try {
        await database.execute(
            "UPDATE User SET profilePhotoPath = ? WHERE idUser = ?",
            [photoPath, idUser]
        );
    } catch (error) {
        return error;
    }
}


const getById = async (id) => {
    try {
        const [user] = await database.execute(
            "SELECT * FROM User WHERE idUser = ?",
            [id]
        );

        if (!user) {
            throw appError("User not found", 404);
        }

        return user;
    } catch (error) {
        return error;
    }
};


const getByEmail = async (email) => {
    try {
        const [user] = await database.execute(
            "SELECT * FROM User WHERE email = ?",
            [email]
        );

        return user;
    } catch (error) {
        return error;
    }
}

module.exports = {
    create,
    updateProfilePhoto,
    getById,
    getByEmail,
}