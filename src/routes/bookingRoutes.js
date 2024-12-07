const express = require('express');
const { body } = require('express-validator');
const BookingController = require('../controllers/BookingController');
const authMiddleware = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const router = express.Router();

// Создание нового бронирования
router.post(
  '/',
  [
    body('venueId').not().isEmpty().withMessage('ID площадки обязателен'),
    body('startTime').isISO8601().withMessage('Некорректное время начала'),
    body('endTime').isISO8601().withMessage('Некорректное время окончания'),
  ],
  BookingController.createBooking
);

// Редактирование бронирования
router.put('/:id', authMiddleware, BookingController.updateBooking);

// Удаление бронирования
router.delete('/:id', authMiddleware, BookingController.deleteBooking);

// Получение списка всех бронирований (для администратора)
router.get('/', BookingController.listBookings);

// Получение информации о конкретном бронировании
router.get('/:id', authMiddleware, BookingController.getBooking);

module.exports = router;
