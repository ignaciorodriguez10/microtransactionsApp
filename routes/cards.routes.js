// routes/cards.routes.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const Card = require('../models/Card');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * GET /cards
 * Mostrar todas las tarjetas del usuario
 */
router.get('/cards', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.userId }).lean();
        res.render('cards', { cards });
    } catch (err) {
        console.error(err);
        res.redirect('/cards?error=Error%20cargando%20tarjetas');
    }
});

/**
 * POST /cards/add
 * Añadir nueva tarjeta
 */
router.post('/cards/add', auth, async (req, res) => {
    const { number, exp_month, exp_year, cvc } = req.body;
    try {
        const brand = number.startsWith('4') ? 'Visa'
            : number.startsWith('5') ? 'Mastercard'
                : 'Desconocida';
        const last4 = number.slice(-4);

        await Card.create({
            user: req.user.userId,
            brand,
            last4,
            exp_month: parseInt(exp_month, 10),
            exp_year: parseInt(exp_year, 10),
            cvc
        });

        res.redirect('/cards?success=Tarjeta%20guardada');
    } catch (err) {
        console.error(err);
        res.redirect('/cards?error=No%20se%20pudo%20guardar%20la%20tarjeta');
    }
});

/**
 * POST /cards/delete/:cardId
 * Eliminar tarjeta
 */
router.post('/cards/delete/:cardId', auth, async (req, res) => {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.redirect('/cards?error=ID%20de%20tarjeta%20no%20válido');
    }
    try {
        const result = await Card.deleteOne({ _id: cardId, user: req.user.userId });
        if (result.deletedCount === 0) {
            return res.redirect('/cards?error=Tarjeta%20no%20encontrada');
        }
        res.redirect('/cards?success=Tarjeta%20eliminada');
    } catch (err) {
        console.error(err);
        res.redirect('/cards?error=Error%20al%20eliminar%20tarjeta');
    }
});

/**
 * POST /cards/recharge
 * Recargar saldo usando una tarjeta guardada, validando en el Credit Card Backend
 */
router.post('/cards/recharge', auth, async (req, res) => {
    const { cardId, cvc, amount } = req.body;

    // Validar formato de cardId
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.redirect('/cards?error=ID%20de%20tarjeta%20no%20válido');
    }

    try {
        // Busca la tarjeta en tu base de datos
        const card = await Card.findOne({ _id: cardId, user: req.user.userId });
        if (!card) {
            return res.redirect('/cards?error=Tarjeta%20no%20encontrada');
        }

        // Llama al Credit Card Backend para validar número, cvv y autorizar
        const response = await axios.post('http://localhost:4000/api/validate-card', {
            cardNumber: `${card.brand === 'Visa' ? '4' : '5'}${'0'.repeat(11)}${card.last4}`,
            cardHolder: req.user.userId, // si necesitas nombre, ajusta según tu modelo
            cvv,
            amount
        });

        if (!response.data.success) {
            return res.redirect(`/cards?error=${encodeURIComponent(response.data.message || 'Error%20validando%20tarjeta')}`);
        }

        // Si todo OK, recarga saldo
        const user = await User.findById(req.user.userId);
        user.balance += parseFloat(amount);
        await user.save();

        await Transaction.create({
            sender: null,
            recipient: user._id,
            amount: parseFloat(amount),
            note: `Recarga con tarjeta ****${card.last4}`
        });

        res.redirect('/cards?success=Saldo%20recargado');
    } catch (err) {
        console.error(err);
        res.redirect('/cards?error=Error%20al%20recargar%20saldo');
    }
});

module.exports = router;
