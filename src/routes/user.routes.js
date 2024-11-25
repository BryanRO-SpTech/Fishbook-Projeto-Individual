const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const multerMiddleware = require("../middlewares/multer.middlewares.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const userCreationConfirm = require("../middlewares/userCreationConfirm.middleware.js");
const router = Router();


router.get("/get/:username", authMiddleware, userController.profile);

router.post("/register", userController.createUser);
router.post("/login", userController.auth);
router.post("/logout", authMiddleware, userController.logout);

router.post("/create-profile-photo", userCreationConfirm, multerMiddleware.uploadProfileMiddleware, userController.updateProfilePhotoOnUserCreate);
router.patch("/update", authMiddleware, userController.updateProfile);
router.patch("/update-profile-photo", authMiddleware, multerMiddleware.uploadProfileMiddleware, userController.updateProfilePhoto);
router.patch("/update-password", authMiddleware, userController.updatePassword);

router.delete("/delete", authMiddleware, userController.deleteProfile);

router.post("/usage-time", authMiddleware, userController.usageTime);

module.exports = router;