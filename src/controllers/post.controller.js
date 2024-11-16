const appError = require("../errors/appError.js");
const postModel = require("../models/post.model.js");

const createPost = async (req, res, next) => {
    const postOwner = req.session.id;
    const caption = req.body.caption;
    const file = req.file;

    const type = file.mimetype === "video/mp4" ? "VIDEO" : "IMAGE"

    const create = await postModel.createPost({
        caption: caption,
        postOwnerId: postOwner,
        filePath: file.filename,
        type
    });

    if (!create) {
        throw appError("Error on post creation", 400);
    }

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

        if (!feed) {
            throw appError("Error on load feed", 500);
        }

        return res.status(200).json(feed);
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
        await postModel.createComment(postId, userId, comment);

        return res.status(201).json({ message: "Comment successfully created" });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createPost,
    getFeed,
    giveLike,
    getComments
}