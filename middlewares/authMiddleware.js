// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer el token directamente de la cookie
    const token = req.cookies && req.cookies.token;
    if (!token) {
        // Si no hay token, redirige al login
        return res.redirect('/login');
    }

    // Verificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            // Token inválido o expirado
            return res.redirect('/login');
        }
        // Inyecta el payload con el userId
        req.user = payload;  // { userId: '...' }
        next();
    });
};
