// credit-card-backend/cardServer.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simulación de validación
app.post('/api/validate-card', (req, res) => {
    const { cardNumber, cardHolder, cvv, amount } = req.body;

    // Simulación simple
    const isValid =
        cardNumber && cardNumber.length === 16 &&
        cvv && cvv.length === 3 &&
        !isNaN(amount) && amount > 0;

    if (!isValid) {
        return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    // Simulamos "aprobación"
    return res.json({ success: true, approvedAmount: amount });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Credit Card Backend corriendo en http://localhost:${PORT}`);
});
