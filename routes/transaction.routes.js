// routes/transaction.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transaction.controller');

// Historial de transacciones
router.get('/profile/transactions', auth, transactionController.getTransactionHistory);

module.exports = router;
    