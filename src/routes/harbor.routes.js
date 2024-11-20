const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const harborController = require('../controllers/harbor.controller.js');

const router = Router();

router.get('/', authMiddleware, harborController.getHarbors);

module.exports = router;