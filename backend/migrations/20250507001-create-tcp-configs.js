'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the tcp_configs table
    await queryInterface.createTable('tcp_configs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      machineId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique identifier for the weighing machine',
      },
      tcpHost: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'TCP host address for the machine',
      },
      tcpPort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'TCP port for the machine',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Insert the default data
    await queryInterface.bulkInsert('tcp_configs', [
      {
        machineId: 'machine_1',
        tcpHost: '10.88.0.44',
        tcpPort: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the tcp_configs table
    await queryInterface.dropTable('tcp_configs');
  },
};