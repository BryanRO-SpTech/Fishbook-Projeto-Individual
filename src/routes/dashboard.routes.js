const { Router } = require("express");
const dashboardController = require("../controllers/dashboard.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.get("/get/kpis", authMiddleware, dashboardController.getKpis);
router.get("/get/likes-group-month", authMiddleware, dashboardController.getLikesGroupByMonth);
router.get("/get/visits-group-month", authMiddleware, dashboardController.getProfileVisitsGroupByMonth);
router.get("/get/usage-group-week", authMiddleware, dashboardController.getProfileUsageTimeGroupByWeek);
router.get("/get/fishery-group-month", authMiddleware, dashboardController.getProfileFisheryGroupByMonth);

module.exports = router;
