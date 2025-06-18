const User = require('../models/User');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');

exports.showRequestForm = async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.render('request-money', { user });
};

exports.sendRequest = async (req, res) => {
    const { recipientEmail, amount, note } = req.body;
    const requesterId = req.user.userId;

    try {
        const recipient = await User.findOne({ email: recipientEmail });

        if (!recipient) return res.redirect('/request-money?error=invalid');
        if (recipient._id.equals(requesterId)) return res.redirect('/request-money?error=self');

        await Request.create({
            sender: requesterId,
            recipient: recipient._id,
            amount: parseFloat(amount),
            note: note || '',
            status: 'pending',
            createdAt: new Date()
        });

        res.redirect('/request-money?success=solicitud');
    } catch (err) {
        console.error('Error creando la solicitud:', err);
        res.redirect('/request-money?error=server');
    }
};


exports.acceptRequest = async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    if (recipient.balance < request.amount) return res.send('Saldo insuficiente');
    if (sender._id.equals(recipient._id)) return res.send('No puedes transferirte a ti mismo');

    sender.balance += parseFloat(request.amount);
    recipient.balance -= parseFloat(request.amount);
    await sender.save();
    await recipient.save();

    await Transaction.create({
        sender: sender._id,
        recipient: recipient._id,
        amount: parseFloat(request.amount),
        note: request.note || '',
        createdAt: new Date()
    });

    request.status = 'accepted';
    await request.save();

    res.redirect('/requests?success=aceptado');
};

exports.cancelRequest = async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    request.status = 'cancelled';
    await request.save();

    res.redirect('/requests?success=cancelado');
};

exports.rejectRequest = async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) return res.send('Solicitud no encontrada');

    const sender = await User.findById(request.sender);
    const recipient = await User.findById(request.recipient);
    if (!sender || !recipient) return res.send('Error en datos');

    request.status = 'rejected';
    await request.save();

    res.redirect('/requests?success=rechazado');
};

exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.send('Solicitud no encontrada');

        

        // Elimina la solicitud
        await Request.findByIdAndDelete(req.params.id);

        res.redirect('/requests?success=eliminado');
    } catch (err) {
        console.error('Error eliminando la solicitud:', err);
        res.redirect('/requests?error=server');
    }
};

exports.viewRequests = async (req, res) => {
    const incoming = await Request.find({
        recipient: req.user.userId,
        status: { $ne: 'cancelled' }
    }).populate('sender');

    const outgoing = await Request.find({
        sender: req.user.userId,
        status: { $ne: 'cancelled' }
    }).populate('recipient');

    res.render('requests', {
        incomingRequests: incoming,
        outgoingRequests: outgoing
    });
};