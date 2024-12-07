const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'Отсутствует токен авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Сохраняем информацию о пользователе в объекте запроса
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Неверный токен авторизации' });
  }
};
