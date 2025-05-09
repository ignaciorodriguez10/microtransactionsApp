// index.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// —— Importar rutas ——  
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const walletRoutes = require('./routes/wallet.routes');
const transferRoutes = require('./routes/transfer.routes');
const requestRoutes = require('./routes/request.routes');
const transactionRoutes = require('./routes/transaction.routes');

// —— Importar middleware y modelos ——  
const auth = require('./middlewares/authMiddleware');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const cardsRoutes = require('./routes/cards.routes');
// ...

// —— Configuración de Express ——  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// —— Conexión a MongoDB ——  
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// —— Ruta raíz ——  
app.get('/', (req, res) => {
    res.redirect('/login');
});

console.log('Cargando authRoutes');
app.use('/', authRoutes);

console.log('Cargando userRoutes');
app.use('/', userRoutes);

console.log('Cargando walletRoutes');
app.use('/', walletRoutes); // <- si falla aquí, ya sabes cuál es

console.log('Cargando transferRoutes');
app.use('/', transferRoutes);

console.log('Cargando requestRoutes');
app.use('/', requestRoutes);

console.log('Cargando transactionRoutes');
app.use('/', transactionRoutes);

console.log('Cargando cardsRoutes');
app.use('/', cardsRoutes);


// —— Dashboard protegido ——  
app.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const transactions = await Transaction.find({ sender: req.user.userId }).populate('recipient');
        if (!user) return res.status(404).render('errors/404');
        res.render('dashboard', { user, transactions });
    } catch (err) {
        console.error(err);
        res.status(500).render('errors/500');
    }
});

// —— Manejo de errores (páginas 404 y 500 opcionales) ——  
app.use((req, res) => {
    res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500');
});

// —— Iniciar servidor ——  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
