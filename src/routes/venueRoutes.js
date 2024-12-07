const express = require('express');
const { body } = require('express-validator');
const VenueController = require('../controllers/VenueController');
const authMiddleware = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const router = express.Router();

// Создание площадки
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Название площадки обязательно'),
    body('description').not().isEmpty().withMessage('Описание площадки обязательно'),
    body('location').not().isEmpty().withMessage('Местоположение площадки обязательно'),
    body('capacity').isInt({ min: 1 }).withMessage('Емкость должна быть числом больше 0'),
  ],
  authMiddleware,
  authorizeAdmin,
  VenueController.createVenue
);

// Редактирование площадки
router.put('/:id', authMiddleware, authorizeAdmin, VenueController.updateVenue);

// Удаление площадки
router.delete('/:id', authMiddleware, authorizeAdmin, VenueController.deleteVenue);

// Получение списка всех площадок
router.get('/', VenueController.listVenues);

// Получение информации о конкретной площадке
router.get('/:id', VenueController.getVenue);

module.exports = router;
