const database = require("../database/config.js");

const listFriendRequests = async (userId) => {
    const friendsRequests = await database.execute(
        `SELECT sender.username, sender.name, sender.profilePhotoPath as photo  FROM FriendRequest
        JOIN User as sender ON sender.idUser = FriendRequest.fkSender
        WHERE FriendRequest.fkReceiver = ?`,
        [userId]
    );

    if (!friendRequest) {
        return false;
    }

    return friendsRequests;
}

const listFriends = async (userId) => {
    const friends = await database.execute(
        `SELECT 
            CASE 
                WHEN u1.idUser = ? THEN u2.name
                ELSE u1.name
            END AS name,
            
            CASE 
                WHEN u1.idUser = ? THEN u2.username
                ELSE u1.username
            END AS username,
            
            CASE 
                WHEN u1.idUser = ? THEN u2.profilePhotoPath
                ELSE u1.profilePhotoPath
            END AS photo
        FROM Friends
        JOIN User AS u1 ON Friends.fkUser1 = u1.idUser
        JOIN User AS u2 ON Friends.fkUser2 = u2.idUser
        WHERE u1.idUser = ? OR u2.idUser = ?;
        `,
        [userId, userId, userId, userId, userId]
    );

    return friends;
}

const getOneFriend = async (username, friendUsername) => {
    const [friend] = await database.execute(
        `SELECT
            CASE
                WHEN u1.username = ? THEN u2.idUser
                ELSE u1.idUser
            END AS friendId,
            CASE
                WHEN u1.username = ? THEN u2.username
                ELSE u1.username
            END AS username,
            
             CASE
                WHEN u1.username = ? THEN u2.name
                ELSE u1.name
            END AS name,

             CASE
                WHEN u1.username = ? THEN u2.profilePhotoPath
                ELSE u1.profilePhotoPath
            END AS photo

            FROM Friends
            JOIN User AS u1 ON fkUser1 = u1.idUser
            JOIN User AS u2 ON fkUser2 = u2.idUser
            WHERE u1.username IN(?, ?) AND u2.username IN(?,?)`,
        [
            username,
            username,
            username,
            username,
            username,
            friendUsername,
            username,
            friendUsername
        ]
    );

    if (!friend) {
        return false;
    }

    return friend;
}


const getOneFriendRequest = async (userId, friendId) => {
    const [friendRequest] = await database.execute(
        "SELECT * FROM FriendRequest WHERE fkReceiver IN(?, ?) AND fkSender IN(?, ?)",
        [friendId, userId, friendId, userId]
    );

    if (!friendRequest) {
        return false;
    }

    return friendRequest;
}

const countFriends = async (userId) => {
    const [result] = await database.execute(
        "SELECT COUNT(fkUser1) AS friendsCount FROM Friends WHERE fkUser1 = ? OR fkUser2 = ?",
        [userId, userId]
    );

    return result;
}

const getFriendsOfFriends = async (userId) => {
    const myFriends = (await database.execute(
        `
        SELECT
            DISTINCT
            CASE
                WHEN fkUser1 = ? THEN fkUser2
                ELSE fkUser1
            END AS idFriend
        FROM Friends 
        WHERE fkUser1  = ? OR fkUser2 = ?;
        `,
        [userId, userId, userId]
    )).map((friend) => {
        return friend.idFriend;
    }).join();

    const friendsOfFriends = await database.execute(
        `
            SELECT 
                DISTINCT 
                CASE 
                    WHEN fkUser1 IN(${myFriends}) THEN fkUser2
                    ELSE fkUser1
                END AS idUser,
                CASE 
                    WHEN fkUser1 IN(${myFriends}) THEN u2.name
                    ELSE u1.name
                END AS name,
                CASE 
                    WHEN fkUser1 IN(${myFriends}) THEN u2.username
                    ELSE u1.username
                END AS username,
                CASE 
                    WHEN fkUser1 IN(${myFriends}) THEN u2.profilePhotoPath
                    ELSE u1.profilePhotoPath
                END AS photo
                FROM Friends
                JOIN User AS u1 ON u1.idUser = fkUser1
                JOIN User AS u2 ON u2.idUser = fkUser2
            WHERE fkUser1 IN(${myFriends}) OR fkUser2 IN(${myFriends}) ORDER BY RAND() LIMIT 15;
        `
    );

    if (friendsOfFriends.length === 15) {
        return friendsOfFriends;
    }

    const randomSuggestions = await database.execute(
        `
            SELECT idUser, name, username, profilePhotoPath AS photo FROM User 
            WHERE idUser != ? AND 
            idUser NOT IN(${friendsOfFriends.map((friendsOfFriends) => friendsOfFriends.idUser).join()}) AND 
            idUser NOT IN(${myFriends})
            ORDER BY RAND()
            LIMIT ${15 - friendsOfFriends.length};
        `,
        [userId]
    );

    return friendsOfFriends.concat(randomSuggestions);

}

const friendRequest = async (idUser, idFriend) => {
    const [friendRequest] = await database.execute(
        "SELECT * FROM FriendRequest WHERE (fkSender = ? AND fkReceiver = ?) OR (fkSender = ? AND fkReceiver = ?)",
        [idUser, idFriend, idFriend, idUser]
    );


    const [friend] = await database.execute(
        "SELECT * FROM Friends WHERE (fkUser1 = ? AND fkUser2 = ?) OR (fkUser1 = ? AND fkUser2 = ?)",
        [idFriend, idUser, idUser, idFriend]
    );

    if (friend || friendRequest) {
        return false;
    }

    const result = await database.execute("INSERT INTO FriendRequest (fkReceiver, fkSender) VALUES (?, ?)", [idFriend, idUser]);

    await database.execute("INSERT INTO Notification (fkReceiver, type, fkFriendRequest) VALUES (?, ?, ?)", [idFriend, "FRIEND", result.insertId]);

    return result;
};

const acceptFriendRequest = async (idUser, idFriend) => {
    const [friendRequest] = await database.execute(
        "SELECT * FROM FriendRequest WHERE fkSender = ? AND fkReceiver = ?",
        [idFriend, idUser]
    );

    if (!friendRequest) {
        return false;
    }

    const result = await database.execute("INSERT INTO Friends (fkUser1, fkUser2) VALUES (?, ?)", [idFriend, idUser]);


    if (!result) {
        return false;
    }

    await database.execute("DELETE FROM FriendRequest WHERE idFriendRequest = ?", [friendRequest.idFriendRequest]);

    return result;
};


const refuseFriend = async (idUser, idFriend) => {
    const [friendRequest] = await database.execute(
        "SELECT * FROM FriendRequest WHERE fkReceiver = ? AND fkSender = ?",
        [idUser, idFriend]
    );

    if (!friendRequest) {
        return false;
    }

    await database.execute(
        "DELETE FROM FriendRequest WHERE idFriendRequest = ?",
        [friendRequest.idFriendRequest]
    );

    return true;
}

const cancelFriendRequest = async (userId, idFriend) => {
    const [friendRequest] = await database.execute(
        "SELECT * FROM FriendRequest WHERE fkReceiver = ? AND fkSender = ?",
        [idFriend, userId]
    );

    if (!friendRequest) {
        return false;
    }

    await database.execute(
        "DELETE FROM FriendRequest WHERE idFriendRequest = ?",
        [friendRequest.idFriendRequest]
    );

    return true;
}

const removeFriend = async (userId, friendId) => {
    await database.execute(
        "DELETE FROM Friends WHERE fkUser1 IN (?, ?) AND fkUser2 IN(?,?)",
        [userId, friendId, userId, friendId]
    );
}


module.exports = {
    listFriendRequests,
    listFriends,
    getOneFriend,
    getOneFriendRequest,
    countFriends,
    friendRequest,
    acceptFriendRequest,
    refuseFriend,
    cancelFriendRequest,
    removeFriend,
    getFriendsOfFriends
};