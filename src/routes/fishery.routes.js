const fisheryController = require("../controllers/fishery.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { Router } = require('express');

const router = Router();

router.post('/create', authMiddleware, fisheryController.createFishery);
router.get('/by-harbor/:harborId', authMiddleware, fisheryController.getFisheriesByHarborId);
router.get("/get/organizer", authMiddleware, fisheryController.getFisheriesCreatedByUser);
router.get("/get/participant", authMiddleware, fisheryController.getFisheriesReservedByUser);
router.delete("/delete/:fisheryId", authMiddleware, fisheryController.deleteFishery);

module.exports = router;
