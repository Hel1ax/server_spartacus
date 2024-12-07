'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Booking, { foreignKey: 'venueId' });
      Venue.hasMany(models.Schedule, { foreignKey: 'venueId' });
    }
  }
  Venue.init(
    {
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      type: DataTypes.STRING,
      pricePerHour: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Venue',
    }
  );
  return Venue;
};
