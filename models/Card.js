const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true },
    last4: { type: String, required: true },
    exp_month: { type: Number, required: true },
    exp_year: { type: Number, required: true },
    cvc: { type: String, required: true }, // guardar con hashing en producción
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', cardSchema);
