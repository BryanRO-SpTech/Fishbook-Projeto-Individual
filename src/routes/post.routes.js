const { Router } = require("express");
const postController = require("../controllers/post.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { uploadPostMiddleware, trimVideoMiddleware } = require("../middlewares/multer.middlewares.js")

const router = Router();

router.post("/create", authMiddleware, uploadPostMiddleware, trimVideoMiddleware, postController.createPost);

module.exports = router;