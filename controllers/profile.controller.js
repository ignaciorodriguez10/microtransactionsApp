const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
};

exports.getEditProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('editProfile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
};

exports.postEditProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.findByIdAndUpdate(req.user.userId, { name, email });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).render('errors/500');
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const password = (req.body.password || '').trim();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).render('errors/404');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Comparando contraseñas:', password, user.password);

    console.log('match:', isMatch);
    if (!isMatch) {
      return res.status(401).render('profile', {
        user,
        error: 'Contraseña incorrecta. No se pudo eliminar la cuenta.'
      });
}



    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.log('No se encontró el usuario a eliminar');
    } else {
      console.log('Usuario eliminado:', deletedUser);
    }

    // Asegúrate de que el nombre de la cookie sea el correcto:
    res.clearCookie('token');

    res.render('auth/success', {
      title: 'Cuenta eliminada',
      message: 'Tu cuenta ha sido eliminada exitosamente.'
    });
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).render('errors/500');
  }
};
