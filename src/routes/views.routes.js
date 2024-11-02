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

module.exports = router
