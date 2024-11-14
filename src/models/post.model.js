const database = require("../database/config.js");
const friendsModel = require("./friends.model.js")

const createPost = async ({ postOwnerId, type, filePath, caption }) => {
    await database.execute(
        `INSERT INTO Post (fkPostOwner, type, filePath, caption) VALUES (?, ?, ?, ?)`,
        [postOwnerId, type, filePath, caption]
    );

    return true;
}

const getFeed = async (userId, lastFriendPost, lastFriendOfFriendPost, lastRandomPost) => {
    const formatDate = (timeStamp) => {
        const date = new Date(timeStamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");;
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, "0");;
        const minute = date.getMinutes().toString().padStart(2, "0");;
        const second = date.getSeconds().toString().padStart(2, "0");;

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }


    const friends = await friendsModel.listFriends(userId);

    const friendsIds = friends.map((friend) => {
        return friend.id;
    }).join();


    const friendsPosts = (await database.execute(
        `SELECT * FROM Post WHERE fkPostOwner IN(${friendsIds}) ${lastFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 20`,
        [lastFriendPost]
    )).map((post) => {
        const date = formatDate(post.dateTime);

        return {
            idPost: post.idPost,
            fkPostOwner: post.fkPostOwner,
            type: post.type,
            filePath: post.filePath,
            caption: post.caption,
            dateTime: date
        }
    });

    const friendsOfFriends = await friendsModel.getFriendsOfFriends(userId);
    const friendsOfFriendsIds = friendsOfFriends.map((friend) => {
        return friend.idUser
    }).join();

    const friendsOfFriendsPosts = (await database.execute(
        `SELECT * FROM Post WHERE fkPostOwner IN(${friendsOfFriendsIds}) ${lastFriendOfFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 20`,
        [lastFriendOfFriendPost]
    )).map((post) => {
        const date = formatDate(post.dateTime);

        return {
            idPost: post.idPost,
            fkPostOwner: post.fkPostOwner,
            type: post.type,
            filePath: post.filePath,
            caption: post.caption,
            dateTime: date
        }
    });

    const randomPosts = (await database.execute(
        `SELECT * FROM Post WHERE fkPostOwner NOT IN(${friendsOfFriendsIds}, ${friendsIds}, ?) ${lastFriendOfFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 20`,
        [userId, lastRandomPost]
    )).map((post) => {
        const date = formatDate(post.dateTime);

        return {
            idPost: post.idPost,
            fkPostOwner: post.fkPostOwner,
            type: post.type,
            filePath: post.filePath,
            caption: post.caption,
            dateTime: date
        }
    });;

    // console.log(friendsPosts);
    // console.log(friendsOfFriendsPosts);
    // console.log(randomPosts);

    return {
        posts: [
            ...friendsPosts,
            ...friendsOfFriendsPosts,
            ...randomPosts
        ],
        lastFriendPostDate: friendsPosts[friendsPosts.length - 1] ? friendsPosts[friendsPosts.length - 1].dateTime : "",
        lastFriendsOfFriendsPostDate: friendsOfFriendsPosts[friendsOfFriendsPosts.length - 1] ? friendsOfFriendsPosts[friendsOfFriendsPosts.length - 1].dateTime : "",
        lastRandomPost: randomPosts[randomPosts.length - 1] ? randomPosts[randomPosts.length - 1].dateTime : ""
    };
}

module.exports = {
    createPost,
    getFeed
};