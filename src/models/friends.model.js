const database = require("../database/config.js");

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


module.exports = {
    friendRequest,
    acceptFriendRequest,
    refuseFriend
};