'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue' });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      venueId: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['confirmed', 'pending', 'canceled']],
        },
      },
      totalPrice: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );
  return Booking;
};
