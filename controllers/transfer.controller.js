const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.getTransferForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('transfer-money', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/transfer-money?error=server');
  }
};



exports.postTransfer = async (req, res) => {
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

    await Transaction.create({
      sender: sender._id,
      recipient: recipient._id,
      amount: parseFloat(amount),
      note
    });

    return res.redirect('/transfer-money?success=transfer');
  } catch (err) {
    console.error(err);
    return res.redirect('/transfer-money?error=server');
  }
};
