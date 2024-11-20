const fisheryController = require("../controllers/fishery.controller.js");
const { Router } = require('express');

const router = Router();

router.get('/by-harbor/:harborId', fisheryController.getFisheriesByHarborId);

module.exports = router;
