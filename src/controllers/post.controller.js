const postModel = require("../models/post.model.js");

const createPost = (req, res, next) => {
    const postOwner = req.session.id;
    const caption = req.body.caption;
    const file = req.file;

    res.send(file.filename);
}

module.exports = {
    createPost
}