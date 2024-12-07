const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Регистрация
router.post(
  '/register',
  [
    body('name').not().isEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  ],
  UserController.register
);

// Авторизация
router.post('/login', UserController.login);

// Получение информации о текущем пользователе
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;
