const { Router } = require("express");

const boatController = require("../controllers/boat.controller.js");
const { uploadBoatMiddleware } = require("../middlewares/multer.middlewares.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/create", authMiddleware, uploadBoatMiddleware, boatController.createBoat);

module.exports = router;
