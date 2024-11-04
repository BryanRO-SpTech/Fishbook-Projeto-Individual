const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const multerMiddleware = require("../middlewares/multer.middlewares.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const userCreationConfirm = require("../middlewares/userCreationConfirm.middleware.js");
const router = Router();

router.post("/register", userController.createUser);
router.post("/login", userController.auth);
router.post("/create-profile-photo", userCreationConfirm, multerMiddleware.uploadProfile.single("profilePhoto"), userController.updateProfilePhotoOnUserCreate);
router.patch("/update", authMiddleware, userController.updateProfile);
router.patch("/update-profile-photo", authMiddleware, multerMiddleware.uploadProfile.single("profilePhoto"), userController.updateProfilePhoto);
router.get("/get/:username", authMiddleware, userController.profile);

module.exports = router;