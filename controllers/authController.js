// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    showRegister: (req, res) => {
        res.render('auth/register');
    },

    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // 1) Comprueba si ya existe el usuario
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.send('Ya existe una cuenta con ese email.');
            }

            // 2) Hashea la contraseña y guarda el usuario
            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(password, salt);
            const user = await User.create({ name, email, password: hashed });

            // 3) Genera el token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // 4) Devuelve JSON con el token
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 2,      // 2 horas (igual que expiresIn)
                    sameSite: 'strict',
                })
                .redirect('/dashboard');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error registrando usuario');
        }
    },

    showLogin: (req, res) => {
        res.render('auth/login');
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            // 1) Validación de credenciales
            if (!user) {
                return res.status(401).send('El usuario no existe.');
            }
            if (!bcrypt.compare(password, user.password)) {
                return res.status(401).send('Contraseña incorrecta.');
            }

            // 2) Genera el token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // 3) Devuelve JSON con el token
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 2,      // 2 horas (igual que expiresIn)
                    sameSite: 'strict',
                })
                .redirect('/dashboard')
        } catch (err) {
            console.error(err);
            res.redirect('/error/500');
        }
    },

    logout: (req, res) => {
        // Con JWT, el logout se maneja en el cliente (borrando el token).
        // Podemos devolver simplemente un status:
        res
            .clearCookie('token', { sameSite: 'strict', httpOnly: true })
            .redirect('/login');
    },
};
