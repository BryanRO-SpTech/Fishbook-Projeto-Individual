const friendsModel = require('../models/friends.model');
const userModel = require('../models/user.model');
const appError = require('../errors/appError');

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

module.exports = {
    friendRequest,
    acceptFriendRequest,
    refuseFriendRequest
};