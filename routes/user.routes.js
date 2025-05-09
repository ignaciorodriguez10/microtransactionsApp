const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');
// userCOntroller
const userController = require('../controllers/userController');

const bcrypt = require('bcryptjs');

// Ver perfil
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.render('profile', { user });
});

// Editar perfil (form)
router.get('/profile/edit', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.render('editProfile', { user });
});

// Guardar cambios
router.post('/profile/edit', auth, async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(req.user.userId, { name, email });
  res.redirect('/profile');
});

// Eliminar cuenta (requiere contraseña)
router.post('/profile/delete', auth, async (req, res) => {
  const userId = req.user.userId;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).render('errors/404');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('profile', {
        user,
        error: 'Contraseña incorrecta. No se pudo eliminar la cuenta.'
      });
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    router.post('/profile/delete', auth, userController.deleteUser);
    res.render('auth/success', {
      title: 'Cuenta eliminada',
      message: 'Tu cuenta ha sido eliminada exitosamente.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
});

module.exports = router;