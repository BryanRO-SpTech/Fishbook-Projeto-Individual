const database = require("../database/config.js");
const friendsModel = require("./friends.model.js")

const createPost = async ({ postOwnerId, type, filePath, caption }) => {
    await database.execute(
        `INSERT INTO Post (fkPostOwner, type, filePath, caption) VALUES (?, ?, ?, ?)`,
        [postOwnerId, type, filePath, caption]
    );

    return true;
}

const getFeed = async (userId) => {
    const friends = await friendsModel.listFriends(userId);

    const friendsIds = friends.map((friend) => {
        return friend.id;
    }).join();

    const friendsPosts = await database.execute(
        `SELECT * from Post WHERE fkPostOwner IN(${friendsIds})`
    );

    return friendsPosts;
}

module.exports = {
    createPost,
    getFeed
};