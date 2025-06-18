const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const cardController = require('../controllers/wallet.controller');

router.get('/cards', auth, cardController.listCards);
router.post('/cards/add', auth, cardController.addCard);
router.delete('/cards/delete/:cardId', auth, cardController.deleteCard);
router.post('/cards/recharge', auth, cardController.rechargeBalance);

module.exports = router;
