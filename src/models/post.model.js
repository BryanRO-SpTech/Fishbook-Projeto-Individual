const database = require("../database/config.js");
const friendsModel = require("./friends.model.js");
const formatDateTime = require("../utils/formatDateTime.js");
const appError = require("../errors/appError.js");

const createPost = async ({ postOwnerId, type, filePath, caption }) => {
    await database.execute(
        `INSERT INTO Post (fkPostOwner, type, filePath, caption) VALUES (?, ?, ?, ?)`,
        [postOwnerId, type, filePath, caption]
    );

    return true;
}

const getFeed = async (userId, lastFriendPost, lastFriendOfFriendPost, lastRandomPost) => {
    try {
        if (lastFriendPost == "undefined" || lastFriendPost == "null") {
            lastFriendPost = "";
        }

        if (lastFriendOfFriendPost == "undefined" || lastFriendOfFriendPost == "null") {
            lastFriendOfFriendPost = "";
        }

        if (lastRandomPost == "undefined" || lastRandomPost == "null") {
            lastRandomPost = "";
        }

        const friends = await friendsModel.listFriends(userId);

        const friendsIds = friends.map((friend) => {
            return friend.id;
        }).join();

        const friendsPosts = friends.length === 0 ? [] : await Promise.all(
            (await database.execute(
                `SELECT * FROM Post
                    JOIN User ON fkPostOwner = idUser
                    WHERE fkPostOwner IN(${friendsIds}) ${lastFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 10 `,
                [lastFriendPost]
            )).map(async (post) => {
                const date = formatDateTime(post.dateTime);

                return {
                    idPost: post.idPost,
                    type: post.type,
                    filePath: post.filePath,
                    caption: post.caption,
                    likes: (await countLikes(post.idPost)).likes,
                    dateTime: date,
                    isLiked: (await countLikesInPostByUser(userId, post.idPost)) > 0,
                    postOwner: {
                        fkPostOwner: post.fkPostOwner,
                        username: post.username,
                        name: post.name,
                        profilePhoto: post.profilePhotoPath
                    }
                }
            })
        );


        const friendsOfFriends = await friendsModel.getFriendsOfFriends(userId);
        const friendsOfFriendsIds = friendsOfFriends.map((friend) => {
            return friend.idUser
        }).join();

        const friendsOfFriendsPosts = friendsOfFriends.length === 0 ? [] : await Promise.all(
            (await database.execute(
                `SELECT * FROM Post
                JOIN User ON fkPostOwner = idUser
                WHERE fkPostOwner IN(${friendsOfFriendsIds}) ${lastFriendOfFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 10`,
                [lastFriendOfFriendPost]
            )).map(async (post) => {
                const date = formatDateTime(post.dateTime);

                return {
                    idPost: post.idPost,
                    type: post.type,
                    filePath: post.filePath,
                    caption: post.caption,
                    dateTime: date,
                    isLiked: (await countLikesInPostByUser(userId, post.idPost)) > 0,
                    likes: (await countLikes(post.idPost)).likes,
                    postOwner: {
                        fkPostOwner: post.fkPostOwner,
                        username: post.username,
                        name: post.name,
                        profilePhoto: post.profilePhotoPath
                    }
                }
            })
        );

        const randomPosts = await Promise.all(
            (await database.execute(
                `SELECT * FROM Post
                JOIN User ON fkPostOwner = idUser
                WHERE fkPostOwner NOT IN(${friendsOfFriendsIds ? friendsOfFriendsIds : 0}, ${friendsIds ? friendsIds : 0}, ?) ${lastFriendOfFriendPost ? `AND dateTime < ?` : ""} ORDER BY dateTime DESC LIMIT 10`,
                [userId, lastRandomPost]
            )).map(async (post) => {
                const date = formatDateTime(post.dateTime);

                return {
                    idPost: post.idPost,
                    type: post.type,
                    filePath: post.filePath,
                    caption: post.caption,
                    dateTime: date,
                    isLiked: (await countLikesInPostByUser(userId, post.idPost)) > 0,
                    likes: (await countLikes(post.idPost)).likes,
                    postOwner: {
                        fkPostOwner: post.fkPostOwner,
                        username: post.username,
                        name: post.name,
                        profilePhoto: post.profilePhotoPath
                    }
                }
            })
        );

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
    } catch (error) {
        return appError("No content", 400);
    }
}

const getPostsByUsername = async (username, myUserId) => {
    const posts = await Promise.all(
        (await database.execute(
            `SELECT * FROM Post 
            JOIN User ON fkPostOwner = idUser
            WHERE username = ? ORDER BY idPost DESC`,
            [username]
        )).map(async (post) => {

            return {
                idPost: post.idPost,
                type: post.type,
                filePath: post.filePath,
                caption: post.caption,
                isLiked: (await countLikesInPostByUser(myUserId, post.idPost)) > 0,
                likes: (await countLikes(post.idPost)).likes,
            }
        })
    );

    return posts;
}

const toggleLike = async (userId, postId) => {
    const [isLiked] = await database.execute(
        `SELECT * FROM Likes WHERE fkPost = ? AND fkLiker = ?`,
        [postId, userId]
    );

    if (isLiked) {
        return {
            unliked: await database.execute(
                `DELETE FROM Likes WHERE idLike = ?`,
                [isLiked.idLike]
            )
        }
    }

    const like = {
        liked: await database.execute(
            `INSERT INTO Likes (fkPost, fkLiker) VALUE (?, ?)`,
            [postId, userId]
        )
    }

    const [post] = await database.execute(
        `SELECT * FROM Post WHERE idPost = ?`,
        [postId]
    );


    await database.execute(
        `INSERT INTO Notification (fkReceiver, type, fkLike) VALUE (?, "LIKE", ?)`,
        [post.fkPostOwner, like.liked.insertId]
    );


    return like;
}


const countLikes = async (idPost) => {
    const [count] = await database.execute(
        "SELECT COUNT(idLike) AS likes FROM Likes WHERE fkPost = ?",
        [idPost]
    );

    return count;
}

const countLikesInPostByUser = async (userId, postId) => {
    const [{ likes }] = await database.execute(
        `SELECT COUNT(idLike) AS likes FROM Likes WHERE fkLiker = ? AND fkPost = ?`,
        [userId, postId]
    );

    return likes;
}

const getComments = async (postId) => {
    const comments = await database.execute(
        `SELECT Comment.*, User.name, User.username, User.profilePhotoPath FROM Comment 
        JOIN User ON idUser = fkCommentAuthor
        WHERE fkPost = ? ORDER BY dateTime DESC`,
        [postId]
    );

    return comments;
}

const createComment = async (postId, userId, comment) => {
    const createComment = await database.execute(
        `INSERT INTO Comment (fkPost, fkCommentAuthor, comment) VALUE (?, ?, ?)`,
        [postId, userId, comment]
    );

    return createComment;
}

module.exports = {
    createPost,
    getFeed,
    getPostsByUsername,
    toggleLike,
    getComments,
    createComment
};