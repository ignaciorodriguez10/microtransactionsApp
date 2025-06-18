const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const transferController = require('../controllers/transfer.controller');

router.get('/transfer-money', auth, transferController.getTransferForm);
router.post('/transfer-money', auth, transferController.postTransfer);

module.exports = router;
