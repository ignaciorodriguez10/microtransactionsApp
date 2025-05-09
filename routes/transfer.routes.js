const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.get('/transfer-money', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.render('transfer-money', { user });
});

router.post('/transfer-money', auth, async (req, res) => {
  try {
    const { recipientEmail, amount, note } = req.body;
    const sender = await User.findById(req.user.userId);
    const recipient = await User.findOne({ email: recipientEmail });
    if (!sender || !recipient) {
      return res.redirect('/transfer-money?error=invalid');
    }
    if (sender.balance < parseFloat(amount)) {
      return res.redirect('/transfer-money?error=insufficient');
    }
    if (amount <= 0) {
      return res.redirect('/transfer-money?error=invalid_amount');
    }
    if (sender._id.equals(recipient._id)) {
      return res.redirect('/transfer-money?error=self');
    }
    sender.balance -= parseFloat(amount);
    recipient.balance += parseFloat(amount);
    await sender.save();
    await recipient.save();
    await Transaction.create({ sender: sender._id, recipient: recipient._id, amount, note });

    // Redirige con éxito
    return res.redirect('/transfer-money?success=transfer');
  } catch (err) {
    console.error(err);
    return res.redirect('/transfer-money?error=server');
  }

});

module.exports = router;
