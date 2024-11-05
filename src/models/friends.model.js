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


const removeFriend = async (userId, friendId) => {
    await database.execute(
        "DELETE FROM Friends WHERE (idUser1 = ? OR idUser2 = ?) AND (idUser1 = ? OR idUser2 = ?)",
        [userId, friendId, userId, friendId]
    );
}


module.exports = {
    listFriendRequests,
    listFriends,
    friendRequest,
    acceptFriendRequest,
    refuseFriend,
    removeFriend
};