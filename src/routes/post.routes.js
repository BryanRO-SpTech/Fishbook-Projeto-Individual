const { Router, urlencoded } = require("express");
const postController = require("../controllers/post.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { uploadPostMiddleware, trimVideoMiddleware } = require("../middlewares/multer.middlewares.js");

const router = Router();

router.get("/feed", authMiddleware, postController.getFeed);
router.get("/:username", authMiddleware, postController.getPostsByUsername);
router.get("/comments/:postId", authMiddleware, postController.getComments);

router.post("/create", authMiddleware, uploadPostMiddleware, trimVideoMiddleware, postController.createPost);
router.post("/like/:postId", authMiddleware, postController.giveLike);
router.post("/comment/:postId", authMiddleware, postController.createComment);

module.exports = router;