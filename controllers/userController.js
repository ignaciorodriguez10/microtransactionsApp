const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Request = require('../models/Request');
const bcrypt = require('bcrypt');


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
