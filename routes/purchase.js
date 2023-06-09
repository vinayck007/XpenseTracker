const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiumuser', authenticateMiddleware.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionStatus);

router.get('/leaderboard', authenticateMiddleware.authenticate, purchaseController.leaderboard);

module.exports = router;