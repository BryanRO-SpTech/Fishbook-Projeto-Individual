const appError = require("../errors/appError.js");
const postModel = require("../models/post.model.js");
const userModel = require("../models/user.model.js");
const commentValidations = require("../validations/comment.validation.js");

const createPost = async (req, res, next) => {
    const postOwner = req.session.id;
    const caption = req.body.caption;
    const file = req.file;

    const type = file.mimetype === "video/mp4" ? "VIDEO" : "IMAGE"

    await postModel.createPost({
        caption: caption,
        postOwnerId: postOwner,
        filePath: file.filename,
        type
    });

    res.status(201).json({
        message: "Post successfully created",
        caption,
        post: file.filename,
        type
    });
}


const getFeed = async (req, res, next) => {
    const { lastFriendPost, lastFriendOfFriendPost, lastRandomPost } = req.query;
    const userId = req.session.id;

    try {
        const feed = await postModel.getFeed(userId, lastFriendPost, lastFriendOfFriendPost, lastRandomPost);

        if (feed && feed.isAppError) {
            throw feed;
        }

        return res.status(200).json(feed);
    } catch (error) {
        return next(error);
    }
}

const getPostsByUsername = async (req, res, next) => {
    let username = req.params.username;
    const myUsername = req.session.username;
    const myUserId = req.session.id;

    try {
        if (username === "my-profile") {
            username = myUsername;
        }

        const user = await userModel.getByUsername(username);

        if (!user) {
            throw appError("User not found", 404);
        }

        const posts = await postModel.getPostsByUsername(username, myUserId);

        return res.status(200).json({
            posts,
            postOwner: {
                username: user.username,
                name: user.name,
                profilePhoto: user.profilePhotoPath
            }
        });
    } catch (error) {
        return next(error);
    }
}

const giveLike = async (req, res, next) => {
    const userId = req.session.id;
    const postId = req.params.postId;

    try {
        const like = await postModel.toggleLike(userId, postId);

        if (!like) {
            throw appError("Error on like");
        }

        if (like.liked) {
            return res.status(200).json({ message: "Post liked" });
        }

        return res.status(200).json({ message: "Post unliked" });
    } catch (error) {
        return next(error);
    }
}


const getComments = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.session.id;

    try {
        const comments = await postModel.getComments(postId);

        return res.status(200).json(comments);
    } catch (error) {
        return next(error);
    }
}

const createComment = async (req, res, next) => {
    const userId = req.session.id;
    const postId = req.params.postId;
    const comment = req.body.comment;

    try {
        const commentValidation = commentValidations.commentsValidation(comment);

        if (!commentValidation.isValid) {
            throw appError(commentValidation.errors, 400);
        }

        await postModel.createComment(postId, userId, comment);

        return res.status(201).json({ message: "Comment successfully created" });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createPost,
    getFeed,
    getPostsByUsername,
    giveLike,
    getComments,
    createComment
}