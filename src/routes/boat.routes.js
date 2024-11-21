const { Router } = require("express");

const boatController = require("../controllers/boat.controller.js");
const { uploadBoatMiddleware } = require("../middlewares/multer.middlewares.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/create", authMiddleware, uploadBoatMiddleware, boatController.createBoat);
router.get("/get", authMiddleware, boatController.getBoats);
router.delete("/delete/:id", authMiddleware, boatController.deleteBoat);

module.exports = router;
