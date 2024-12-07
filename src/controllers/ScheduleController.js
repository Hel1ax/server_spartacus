const { Schedule, Venue } = require('../models');

exports.createSchedule = async (req, res) => {
  const { venueId, dayOfWeek, startTime, endTime } = req.body;

  try {
    // Проверка существования площадки
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    // Создание нового расписания
    const schedule = await Schedule.create({
      venueId,
      dayOfWeek,
      startTime,
      endTime,
    });

    res.status(201).json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

exports.updateSchedule = async (req, res) => {
  const scheduleId = req.params.id
  if (isNaN(scheduleId)) {
    return res.status(400).json({ msg: 'Некорректный ID расписания' });
  }

  const { venueId, dayOfWeek, startTime, endTime } = req.body;

  try {
    // Получаем расписание из базы
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ msg: 'Расписание не найдено' });
    }

    // Проверка, что площадка существует
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    // Обновление расписания
    schedule.venueId = venueId || schedule.venueId;
    schedule.dayOfWeek = dayOfWeek || schedule.dayOfWeek;
    schedule.startTime = startTime || schedule.startTime;
    schedule.endTime = endTime || schedule.endTime;

    await schedule.save();

    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

exports.deleteSchedule = async (req, res) => {
  const scheduleId = parseInt(req.params.id, 10);
  if (isNaN(scheduleId)) {
    return res.status(400).json({ msg: 'Некорректный ID расписания' });
  }

  try {
    // Удаление расписания
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ msg: 'Расписание не найдено' });
    }

    await schedule.destroy();

    res.json({ msg: 'Расписание удалено' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

exports.getSchedules = async (req, res) => {
  try {
    // Получаем все расписания
    const schedules = await Schedule.findAll();
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

exports.getScheduleByVenue = async (req, res) => {
  const venueId = parseInt(req.params.venueId, 10);
  if (isNaN(venueId)) {
    return res.status(400).json({ msg: 'Некорректный ID площадки' });
  }

  try {
    // Получаем расписания для определенной площадки
    const schedules = await Schedule.findAll({ where: { venueId } });
    if (!schedules.length) {
      return res.status(404).json({ msg: 'Расписания для этой площадки не найдены' });
    }

    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};
