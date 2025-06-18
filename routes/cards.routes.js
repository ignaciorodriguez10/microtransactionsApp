const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const cardController = require('../controllers/card.controller');

router.get('/cards', auth, cardController.getCards);
router.post('/cards/add', auth, cardController.addCard);
router.delete('/cards/delete/:cardId', auth, cardController.deleteCard);
router.post('/cards/recharge', auth, cardController.rechargeBalance);

module.exports = router;



/*
router.get('/cards', auth, cardController.getCards);
router.get('/cards/:cardid', auth, cardController.getCards);
router.post('/cards', auth, cardController.addCard);
router.delete('/cards', auth, cardController.deleteCard);
router.post('/cards/recharge:', auth, cardController.rechargeBalance);
*/