const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const userController = require('../controllers/profile.controller');

router.get('/profile', auth, userController.getProfile);
router.get('/profile/edit', auth, userController.getEditProfile);
router.put('/profile/edit', auth, userController.postEditProfile);
router.delete('/profile/delete', auth, userController.deleteUser);


module.exports = router;
