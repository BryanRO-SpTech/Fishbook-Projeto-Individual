const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const multerMiddleware = require("../middlewares/multer.middlewares.js");

const router = Router();

router.post("/register", userController.createUser);
router.post("/auth", userController.auth);

module.exports = router;