// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
