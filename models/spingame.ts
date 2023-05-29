'use strict';
import { Model } from 'sequelize';

interface SpingameAttributes {
  id: string;
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class SpinGame extends Model<SpingameAttributes> implements SpingameAttributes {
    id!: string;
    name!: string;

    static associate(models : any) {
      // define association here
      SpinGame.hasMany(models.Prize, {
        foreignKey: 'spin_game_id'
      })
    }
  }
  SpinGame.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SpinGame',
    tableName: 'spin_games',
  });
  return SpinGame;
};