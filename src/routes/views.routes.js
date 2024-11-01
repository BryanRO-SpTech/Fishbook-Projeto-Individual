const { Router } = require("express");
const path = require("path");

const viewsPath = path.join(__dirname, "../../views")

const router = Router();

router.get("/login", (req, res) => {
    return res.sendFile(path.join(viewsPath, "login.html"));
});

router.get("/register", (req, res) => {
    return res.sendFile(path.join(viewsPath, "register.html"));
});


module.exports = router
