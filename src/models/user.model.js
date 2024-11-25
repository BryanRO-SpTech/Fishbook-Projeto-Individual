const database = require("../database/config.js");
const appError = require("../errors/appError.js");

const create = async ({ name, email, username, password, bio }) => {
    try {
        const [user] = await database.execute("SELECT username, email FROM User WHERE username = ? || email = ? ", [username, email]);

        if (user && user.email === email) {
            throw appError("Email already in use", 400);
        }

        if (user && user.username === username) {
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

const updateProfile = async (idUser, { name, email, bio }) => {
    const updateData = [];
    const data = [];

    if (name) {
        updateData.push("name = ?");
        data.push(name);
    }

    if (email) {
        updateData.push("email = ?");
        data.push(email);
    }

    if (bio) {
        updateData.push("bio = ?");
        data.push(bio);
    }

    try {
        const [user] = await database.execute("SELECT email FROM User WHERE email = ? AND idUser != ?", [email, idUser]);

        if (user) {
            throw appError("Email already in use", 400);
        }

        await database.execute(`UPDATE User SET ${updateData.join(", ")} WHERE idUser = ?`, data.concat(idUser));

        return true;
    } catch (error) {
        return error;
    }
};


const updatePassword = async (idUser, password) => {
    try {
        await database.execute("UPDATE User SET password = ? WHERE idUser = ?", [password, idUser]);
        return true;
    } catch (error) {
        return error;
    }
};

const getById = async (id) => {
    try {
        const [user] = await database.execute(
            "SELECT * FROM User WHERE idUser = ?",
            [id]
        );

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

const getByUsername = async (username) => {
    try {
        const [user] = await database.execute(
            "SELECT * FROM User WHERE username = ?",
            [username]
        );

        return user;
    } catch (error) {
        return error;
    }
}

const deleteProfile = async (idUser) => {
    try {
        const result = await database.execute("DELETE FROM User WHERE idUser = ?", [idUser]);

        return result;
    } catch (error) {
        return error;
    }
}

const registerProfileVisit = async (visitedId, visitorId) => {
    try {
        const insert = await database.execute(
            `INSERT INTO ProfileVisit (fkUser, fkVisitor) VALUE (?, ?)`,
            [visitedId, visitorId]
        );
    } catch (error) {
        return error.code;
    }
}

const usageTime = async (userId) => {
    const [verifyLastUsageDay] = await database.execute(
        `SELECT * FROM UsageTime WHERE DATE(date) = CURRENT_DATE AND fkUser = ?`,
        [userId]
    );

    if (verifyLastUsageDay) {
        const lastUpdateInMs = Date.parse(verifyLastUsageDay.lastUpdate);
        const currentTimeInMs = Date.parse(new Date());

        const diferenceInSeconds = (currentTimeInMs - lastUpdateInMs) / 1000;

        if (diferenceInSeconds < 60) {
            return;
        }



        return await database.execute(
            `UPDATE UsageTime SET usageTimeInMinutes = ${++verifyLastUsageDay.usageTimeInMinutes}, lastUpdate = NOW() WHERE idUsageTime = ${verifyLastUsageDay.idUsageTime}`
        );
    }

    return await database.execute(
        `INSERT INTO usageTime (usageTimeInMinutes, fkUser, lastUpdate) VALUES (?, ?, NOW())`,
        [1, userId]
    );
}


const getLikeUserNameOrName = (value) => {
    if (value[0] === "@") {
        value = value.replace("@", "");
    }

    const results = database.execute(
        `SELECT name, username, profilePhotoPath FROM User WHERE name LIKE ? OR username LIKE ? LIMIT 5`,
        [`%${value}%`, `%${value}%`]
    );

    return results;
}

module.exports = {
    create,
    updateProfilePhoto,
    updateProfile,
    updatePassword,
    getById,
    getByEmail,
    getByUsername,
    deleteProfile,
    registerProfileVisit,
    usageTime,
    getLikeUserNameOrName
}