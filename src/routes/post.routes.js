const { Router } = require("express");
const postController = require("../controllers/post.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { uploadPostMiddleware, trimVideoMiddleware } = require("../middlewares/multer.middlewares.js");

const router = Router();

router.get("/feed", authMiddleware, postController.getFeed);
router.get("/comments/:postId", authMiddleware, postController.getComments);

router.post("/create", authMiddleware, uploadPostMiddleware, trimVideoMiddleware, postController.createPost);
router.post("/like/:postId", authMiddleware, postController.giveLike);

module.exports = router;