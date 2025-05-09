// routes/cards.routes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const Card = require('../models/Card');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * LISTAR TARJETAS
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
 * AÑADIR NUEVA TARJETA
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
 * ELIMINAR TARJETA
 */
router.post('/cards/delete/:cardId', auth, async (req, res) => {
  const { cardId } = req.params;
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
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
 * RECARGAR SALDO CON TARJETA GUARDADA
 */
router.post('/cards/recharge', auth, async (req, res) => {
  const { cardId, cvc, amount } = req.body;
  if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
    return res.redirect('/cards?error=ID%20de%20tarjeta%20no%20válido');
  }
  try {
    const card = await Card.findOne({ _id: cardId, user: req.user.userId });
    if (!card) {
      return res.redirect('/cards?error=Tarjeta%20no%20encontrada');
    }
    if (card.cvc !== cvc) {
      return res.redirect('/cards?error=CVC%20incorrecto');
    }
    const monto = parseFloat(amount);
    if (isNaN(monto) || monto <= 0) {
      return res.redirect('/cards?error=Monto%20no%20válido');
    }

    const user = await User.findById(req.user.userId);
    user.balance += monto;
    await user.save();

    await Transaction.create({
      sender: null,
      recipient: user._id,
      amount: monto,
      note: `Recarga con tarjeta ****${card.last4}`
    });

    res.redirect('/cards?success=Saldo%20recargado');
  } catch (err) {
    console.error(err);
    res.redirect('/cards?error=Error%20al%20recargar%20saldo');
  }
});

module.exports = router;


