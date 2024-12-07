'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Venue, { foreignKey: 'venueId' });
    }
  }
  Schedule.init(
    {
      venueId: DataTypes.INTEGER,
      dayOfWeek: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
        },
      },
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: 'Schedule',
    }
  );
  return Schedule;
};
