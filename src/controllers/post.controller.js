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
    const teste = await postModel.getFeed(req.session.id);
    res.json(teste);
}

module.exports = {
    createPost,
    getFeed
}