// utils/generateTokens.js
const jwt = require('jsonwebtoken');

// Función para generar un JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Función para verificar un JWT (esto se usará en las rutas protegidas)
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
