const express = require('express');

const premiumController = require('../controller/premium');

const authenticateMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/leaderboard', authenticateMiddleware.authenticate, premiumController.leaderboard);

module.exports = router;