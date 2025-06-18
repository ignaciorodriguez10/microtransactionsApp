const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const requestController = require('../controllers/request.controller');

router.get('/request-money', auth, requestController.showRequestForm);
router.post('/request-money', auth, requestController.sendRequest);
router.get('/requests', auth, requestController.viewRequests);
router.post('/requests/accept/:id', auth, requestController.acceptRequest);
router.post('/requests/cancel/:id', auth, requestController.cancelRequest);
router.post('/requests/reject/:id', auth, requestController.rejectRequest);
router.post('/requests/delete/:id', requestController.deleteRequest);

module.exports = router;
