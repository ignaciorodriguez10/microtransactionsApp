const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Request = require('../models/Request');
const bcrypt = require('bcrypt');

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).render('messages/success', {
                title: 'Error',
                message: 'Usuario no encontrado.'
            });
        }

        // Confirmar contraseña
        const { password } = req.body;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('messages/success', {
                title: 'Contraseña incorrecta',
                message: 'La contraseña ingresada no es válida.'
            });
        }

        // Eliminar transacciones asociadas
        await Transaction.deleteMany({
            $or: [
                { sender: user._id },
                { recipient: user._id }
            ]
        });

        // Eliminar solicitudes asociadas
        await Request.deleteMany({
            $or: [
                { sender: user._id },
                { recipient: user._id }
            ]
        });

        // Eliminar las tarjetas asociadas
        await Card.deleteMany({ user: user._id });


        // Eliminar el usuario
        await User.findByIdAndDelete(user._id);

        // Limpiar cookies y redirigir
        res.clearCookie('token');
        return res.render('messages/success', {
            title: 'Usuario eliminado correctamente',
            message: 'Tu cuenta y todos tus datos han sido eliminados de forma segura.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('errors/500');
    }
};

exports.editProfile = async (req, res) => {
    const { name, email } = req.body;
    const currentUserId = req.session.userId; // o como tengas guardado el usuario autenticado

    try {
        // Comprobar si el nuevo email ya está en uso por otro usuario
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser._id.toString() !== currentUserId) {
            return res.render('profile/edit', {
                user: { name, email },
                error: 'El correo electrónico ya está en uso por otro usuario.'
            });
        }

        // Actualizar los datos del usuario
        await User.findByIdAndUpdate(currentUserId, { name, email });
        res.redirect('/profile?updated=true');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando perfil');
    }
};
