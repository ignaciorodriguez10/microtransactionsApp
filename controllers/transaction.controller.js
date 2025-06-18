const Transaction = require('../models/Transaction');
const User = require('../models/User'); // Ajusta el path si es distinto

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'email name')
      .populate('recipient', 'email name')
      .exec();

    // Pasamos el user completo (id + name) para usarlo en la vista
    const user = await User.findById(userId).select('_id name');

    res.render('transaction-history', {
      transactions,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar el historial de transacciones');
  }
};
