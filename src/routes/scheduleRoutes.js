const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/ScheduleController');

// Создание расписания
router.post('/', scheduleController.createSchedule);

// Обновление расписания по ID
router.put('/:id', scheduleController.updateSchedule);

// Удаление расписания по ID
router.delete('/:id', scheduleController.deleteSchedule);

// Получение всех расписаний
router.get('/', scheduleController.getSchedules);

// Получение расписаний для определенной площадки
router.get('/venue/:venueId', scheduleController.getScheduleByVenue);

module.exports = router;
