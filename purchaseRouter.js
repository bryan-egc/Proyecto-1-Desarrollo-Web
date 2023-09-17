const express = require('express');
const { purchase } = require('./purchaseController');
const verifyToken = require('./authMiddleware');

const router = express.Router();

router.post('/compra', verifyToken, purchase);

module.exports = router;
