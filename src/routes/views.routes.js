const { Router } = require("express");
const path = require("path");
const authMiddleware = require("../middlewares/auth.middleware.js");
const alreadyAuth = require("../middlewares/alreadyAuth.middleware.js")

const viewsPath = path.join(__dirname, "../../views")

const router = Router();

router.get("/login", alreadyAuth, (req, res) => {
    return res.sendFile(path.join(viewsPath, "login.html"));
});

router.get("/register", alreadyAuth, (req, res) => {
    return res.sendFile(path.join(viewsPath, "register.html"));
});

router.get("/feed", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "feed.html"));
});

router.get("/profile/:username", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "profile.html"));
});

router.get("/profile-config", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "profileConfig.html"));
});

router.get("/change-password", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "changePassword.html"));
});

router.get("/delete", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "deleteProfile.html"));
});

router.get("/profile/:username/friends", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "friends.html"));
})

router.get("/friend-requests", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "friendRequest.html"));
});

router.get("/post", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "post.html"));
});

router.get("/profile-dashboard", (req, res) => {
    return res.sendFile(path.join(viewsPath, "profileDashboard.html"));
});

router.get("/fish", authMiddleware, (req, res) => {
    return res.sendFile(path.join(viewsPath, "fish.html"));
});

module.exports = router
