const friendsModel = require('../models/friends.model.js');
const userModel = require('../models/user.model.js');
const appError = require('../errors/appError.js');

const listFriendRequests = async (req, res, next) => {
    const { id } = req.session;

    try {
        const friendRequests = await friendsModel.listFriendRequests(id);

        if (!friendRequest) {
            throw appError("Error on friends Request List", 500);
        }

        return res.status(200).json(friendRequests);
    } catch (error) {
        next(error);
    }
}

const listFriends = async (req, res, next) => {
    const id = req.session.id;
    const myUsername = req.session.username
    let username = req.params.username;

    try {
        if (username === "my-friends" || username === "my-profile") {
            username = myUsername;
        }

        const user = await userModel.getByUsername(username);

        const friends = await friendsModel.listFriends(user.idUser);

        if (!friends) {
            throw appError("Error on list friends", 500);
        }

        return res.status(200).json({
            friends,
            isMyFriends: id == user.idUser
        });
    } catch (error) {
        return next(error);
    }

}

const countFriends = async (req, res, next) => {
    const myUsername = req.session.username;
    let username = req.params.username;

    try {
        if (username === "my-profile") {
            username = myUsername;
        }

        const user = await userModel.getByUsername(username);

        if (!user) {
            throw appError("User not found", 400)
        }

        const count = await friendsModel.countFriends(user.idUser);

        return res.status(200).json(count);
    } catch (error) {
        return next(error);
    }
}

const friendRequest = async (req, res, next) => {
    const { friendUsername } = req.params;
    const { id } = req.session;

    try {
        const user = await userModel.getByUsername(friendUsername);

        if (!user) {
            throw appError("Friend not exists", 404);
        }

        if (user.idUser === id) {
            throw appError("You can't send friend request to yourself", 400);
        }

        const result = await friendsModel.friendRequest(id, user.idUser);

        if (!result) {
            throw appError("Friend request already sent", 400);
        }

        return res.status(201).json({ message: "Friend request sent" });

    } catch (error) {
        next(error);
    }
};

const acceptFriendRequest = async (req, res, next) => {
    const { friendUsername } = req.params;
    const { id } = req.session;

    try {
        const friend = await userModel.getByUsername(friendUsername);

        if (!friend) {
            throw appError("Friend not exists", 404);
        }

        if (friend.idUser === id) {
            throw appError("You can't accept friend request from yourself", 400);
        }

        const result = await friendsModel.acceptFriendRequest(id, friend.idUser);

        if (!result) {
            throw appError("Friend request not found", 404);
        }

        return res.status(201).json({ message: "Friend request accepted" });

    } catch (error) {
        next(error);
    }
};

const refuseFriendRequest = async (req, res, next) => {
    const { id } = req.session;
    const friendUsername = req.params.friendUsername;

    try {
        const friend = await userModel.getByUsername(friendUsername);

        if (friend.idUser === id) {
            throw appError("You can't refuse friend request from yourself", 400);
        }

        const friendRequest = await friendsModel.refuseFriend(id, friend.idUser);

        if (!friendRequest) {
            throw appError("Friend Request not found.", 400);
        }

        return res.status(200).json({ message: "Request refused" });
    } catch (error) {
        next(error);
    }
}

const cancelFriendRequest = async (req, res, next) => {
    const { id } = req.session;
    const friendUsername = req.params.friendUsername;

    try {
        const friend = await userModel.getByUsername(friendUsername);

        if (!friend) {
            throw appError("Friend not found", 400);
        }

        const friendRequest = await friendsModel.cancelFriendRequest(id, friend.idUser);

        if (!friendRequest) {
            throw appError("Friend request not found", 400);
        }

        return res.status(200).json({ message: "Friend Request cancelled" });
    } catch (error) {
        return next(error);
    }

}

const removeFriend = async (req, res, next) => {
    const { id, username } = req.session;
    const friendUsername = req.params.friendUsername;

    try {
        if (username === friendUsername) {
            throw appError("You can't remove yourself.", 400);
        }

        const friend = await friendsModel.getOneFriend(username, friendUsername);

        if (!friend) {
            throw appError("Friend not found", 400);
        }

        await friendsModel.removeFriend(id, friend.friendId);

        return res.status(200).json({ message: "Friend removed" });
    } catch (error) {
        return next(error);
    }
}

const friendsSuggestions = async (req, res, next) => {
    const userId = req.session.id;

    const friendsOfFriends = await friendsModel.getFriendsOfFriends(userId);

    res.json(friendsOfFriends);
}

module.exports = {
    listFriendRequests,
    listFriends,
    countFriends,
    friendRequest,
    acceptFriendRequest,
    refuseFriendRequest,
    cancelFriendRequest,
    removeFriend,
    friendsSuggestions
};