const { validationResult } = require('express-validator');
const { Venue } = require('../models');

// Создание новой площадки
exports.createVenue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, location, capacity, type, pricePerHour } = req.body;

  try {
    // Создание новой площадки
    const venue = await Venue.create({
      name,
      description,
      location,
      capacity,
      type,
      pricePerHour
    });

    res.status(201).json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Редактирование информации о площадке
exports.updateVenue = async (req, res) => {
  const { name, description, location, capacity, type, pricePerHour } = req.body;
  const venueId = req.params.id;

  try {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    // Обновление информации о площадке
    venue.name = name || venue.name;
    venue.description = description || venue.description;
    venue.location = location || venue.location;
    venue.capacity = capacity || venue.capacity;
    venue.type = type || venue.type;
    venue.pricePerHour = pricePerHour || venue.pricePerHour;

    await venue.save();

    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление площадки
exports.deleteVenue = async (req, res) => {
  const venueId = req.params.id;

  try {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    await venue.destroy();
    res.json({ msg: 'Площадка удалена' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение списка всех площадок
exports.listVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.json(venues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение информации о конкретной площадке
exports.getVenue = async (req, res) => {
  const venueId = req.params.id;

  try {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ msg: 'Площадка не найдена' });
    }

    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};
