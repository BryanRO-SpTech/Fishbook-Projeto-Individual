const database = require("../database/config.js");

const createPost = async ({ postOwnerId, type, filePath, caption }) => {
    await database.execute(
        `INSERT INTO Post (fkPostOwner, type, filePath, caption) VALUES (?, ?, ?, ?)`,
        [postOwnerId, type, filePath, caption]
    );

    return true;

}

module.exports = {
    createPost
};