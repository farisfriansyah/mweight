'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable('tcp_configs', {
              id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
              },
              machineId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                comment: 'Unique identifier for the weighing machine'
              },
              tcpHost: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'TCP host address for the machine'
              },
              tcpPort: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'TCP port for the machine'
              },
              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
              },
              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
              }
            }));

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(queryInterface.bulkInsert('tcp_configs', [{
              machineId: 'machine_1',
              tcpHost: '10.88.0.44',
              tcpPort: 23,
              createdAt: new Date(),
              updatedAt: new Date()
            }]));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  down: function down(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function down$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(queryInterface.dropTable('tcp_configs'));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};