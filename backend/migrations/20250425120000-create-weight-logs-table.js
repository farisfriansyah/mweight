'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('weight_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      rawWeight: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      processedWeight: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      timestamps: false, // Disable Sequelize's automatic createdAt/updatedAt
      tableName: 'weight_logs',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('weight_logs');
  }
};