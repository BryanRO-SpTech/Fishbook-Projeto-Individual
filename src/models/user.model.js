const database = require("../database/config.js");
const appError = require("../errors/appError.js");

const create = async ({ name, email, username, password, bio }) => {
    try {
        const countUsers = await database.execute("SELECT COUNT(idUser) AS quantUser FROM User WHERE username = ? || email = ? ", [username, email]);

        if (countUsers[0].quantUser > 0) {
            throw appError("User already exists", 400);
        }

        await database.execute(
            "INSERT INTO User (name, email, username, password, bio) VALUES (?, ?, ?, ?, ?)",
            [name, email, username, password, bio]
        );
    } catch (error) {
        return error;
    }
}


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
    getByEmail
}