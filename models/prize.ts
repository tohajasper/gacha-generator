'use strict';
import { Model } from 'sequelize';

interface PrizeAttributes {
  id: string;
  name: string;
  probability: number;
  spin_game_id: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Prize extends Model<PrizeAttributes> implements PrizeAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    name!: string;
    probability!: number;
    spin_game_id!: string;

    static associate(models: any) {
      // define association here
      Prize.belongsTo(models.SpinGame, {
        foreignKey: 'spin_game_id'
      })
    }
  }
  Prize.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    probability: DataTypes.DECIMAL,
    spin_game_id: {
      type: DataTypes.UUID, 
      onUpdate: "cascade",
      onDelete: "cascade"
    }
  }, {
    sequelize,
    modelName: 'Prize',
    tableName: 'prizes'
  });
  return Prize;
};