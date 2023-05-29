"use strict";
import { Model } from "sequelize";

interface SpinGameHistoryAttributes {
  id: string;
  roll: number;
  prize_data: JSON;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class SpinGameHistory
    extends Model<SpinGameHistoryAttributes>
    implements SpinGameHistoryAttributes
  {
    id!: string;
    roll!: number;
    prize_data!: JSON;
    static associate(models: any) {
      // define association here
    }
  }
  SpinGameHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roll: DataTypes.DECIMAL,
      prize_data: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "SpinGameHistory",
      tableName: "spin_game_histories",
    }
  );
  return SpinGameHistory;
};
