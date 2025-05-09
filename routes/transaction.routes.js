// routes/transaction.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Transaction = require('../models/Transaction');

// Historial de transacciones (ruta original: /profile/transactions)
router.get('/profile/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction
            .find({ sender: req.user.userId })
            .populate('recipient', 'email name')
            .exec();
        res.render('transaction-history', { transactions });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar el historial de transacciones');
    }
});

module.exports = router;
