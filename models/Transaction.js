const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
