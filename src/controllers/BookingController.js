const { validationResult } = require('express-validator');
const { Booking, Venue } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');

// Создание нового бронирования

const calculateTotalPrice = (startTime, endTime, pricePerHour) => {
    const duration = moment(endTime).diff(moment(startTime), 'hours');
    return duration * pricePerHour;
};

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { venueId, startTime, endTime, userId, status } = req.body;

  try {
    // Проверка доступности площадки
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    // Проверка на пересечение времени с другими бронированиями
    const existingBooking = await Booking.findOne({
      where: {
        venueId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ msg: 'Площадка уже забронирована на это время' });
    }
    const totalPrice = calculateTotalPrice(startTime, endTime, venue.pricePerHour);

    // Создание нового бронирования
    const booking = await Booking.create({
      venueId,
      userId,
      startTime,
      endTime,
      status: status || 'pending',
      totalPrice: totalPrice || 0 // Статус по умолчанию — ожидание
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Редактирование существующего бронирования
exports.updateBooking = async (req, res) => {
  const { startTime, endTime, status } = req.body;
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: 'Бронирование не найдено' });
    }

    // Проверка доступности площадки на новое время
    const existingBooking = await Booking.findOne({
      where: {
        venueId: booking.venueId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        id: { [Op.ne]: bookingId }, // Исключаем текущее бронирование
      },
    });

    if (existingBooking) {
      return res.status(400).json({ msg: 'Площадка уже забронирована на это время' });
    }
    const venue = await Venue.findByPk(booking.venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    const totalPrice = calculateTotalPrice(startTime, endTime, venue.pricePerHour);

    // Обновление данных бронирования
    booking.startTime = startTime || booking.startTime;
    booking.endTime = endTime || booking.endTime;
    booking.status = status || booking.status;
    booking.totalPrice = totalPrice || booking.totalPrice;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление бронирования
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: 'Бронирование не найдено' });
    }

    await booking.destroy();
    res.json({ msg: 'Бронирование удалено' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение списка всех бронирований (для администратора)
exports.listBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Venue, as: 'venue' }],
    });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение информации о конкретном бронировании
exports.getBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Venue, as: 'venue' }],
    });
    if (!booking) {
      return res.status(404).json({ msg: 'Бронирование не найдено' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};
