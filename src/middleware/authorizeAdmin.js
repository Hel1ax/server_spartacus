module.exports = (req, res, next) => {
    // Проверка, является ли пользователь администратором
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }
    next();
  };
  