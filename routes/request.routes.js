// routes/request.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');

// 1) Mostrar formulario de solicitar dinero → GET /request-money
router.get('/request-money', auth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    // Solo renderizar el form; el listado lo hacemos en /requests
    res.render('request-money', { user });
});

// 2) Enviar solicitud → POST /request-money
router.post('/request-money', auth, async (req, res) => {
    const { recipientEmail, amount, note } = req.body;
    const requesterId = req.user.userId;

    try {
        const recipient = await User.findOne({ email: recipientEmail });

        // Usuario no existe
        if (!recipient) {
            return res.redirect('/request-money?error=invalid');
        }

        // Mismo usuario
        if (recipient._id.equals(requesterId)) {
            return res.redirect('/request-money?error=self');
        }

        // Crear solicitud
        await Request.create({
            sender: requesterId,
            recipient: recipient._id,
            amount: parseFloat(amount),
            note: note || '',
            status: 'pending',
            createdAt: new Date()
        });

        return res.redirect('/request-money?success=solicitud');

    } catch (err) {
        console.error('Error creando la solicitud:', err);
        return res.redirect('/request-money?error=server');
    }
});

// 3) Mostrar todas las solicitudes (recibidas y enviadas) → GET /requests
router.get('/requests', auth, async (req, res) => {
    const incoming = await Request.find({ recipient: req.user.userId, status: { $ne: 'cancelled' } }).populate('sender');
    const outgoing = await Request.find({ sender: req.user.userId, status: { $ne: 'cancelled' } }).populate('recipient');
    res.render('requests', { incomingRequests: incoming, outgoingRequests: outgoing });
});

// 4) Aceptar solicitud → POST /requests/accept/:id
router.post('/requests/accept/:id', auth, async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    if (recipient.balance < request.amount) return res.send('Saldo insuficiente');

    if (sender._id.equals(recipient._id)) return res.send('No puedes transferirte a ti mismo');

    // Realizar transferencia
    sender.balance -= parseFloat(request.amount);
    recipient.balance += parseFloat(request.amount);
    await sender.save();
    await recipient.save();

    // Registrar transacción
    await Transaction.create({
        sender: sender._id,
        recipient: recipient._id,
        amount: parseFloat(request.amount),
        note: request.note || '',
        createdAt: new Date()
    });

    // Marcar solicitud como aceptada
    request.status = 'accepted';
    await request.save();

    res.redirect('/requests?success=aceptado');
});

// 5) Rechazar/cancelar solicitud → POST /requests/cancel/:id
router.post('/requests/cancel/:id', auth, async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    request.status = 'cancelled';
    await request.save();

    res.redirect('/requests?success=cancelado');
});

// 6) Rechazar solicitud → POST /requests/reject/:id
router.post('/requests/reject/:id', auth, async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    request.status = 'rejected';
    await request.save();

    res.redirect('/requests?success=rechazado');
});

module.exports = router;
