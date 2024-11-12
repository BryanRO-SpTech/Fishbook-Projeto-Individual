const { Router } = require("express");
const postController = require("../controllers/post.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js")

const router = Router();


router.post(postController.createPost)