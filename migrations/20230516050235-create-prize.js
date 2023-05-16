'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prizes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      spin_game_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "spin_games",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      name: {
        type: Sequelize.STRING
      },
      probability: {
        type: Sequelize.DECIMAL,
        validate: {
          min: 0,
          max: 1
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prizes');
  }
};