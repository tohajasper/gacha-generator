'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpinGameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SpinGameHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roll: DataTypes.DECIMAL,
    prize_data: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'SpinGameHistory',
    tableName: 'spin_game_histories'
  });
  return SpinGameHistory;
};