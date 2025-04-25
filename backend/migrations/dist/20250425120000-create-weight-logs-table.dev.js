'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable('weight_logs', {
              id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
              },
              rawWeight: {
                type: Sequelize.TEXT,
                allowNull: false
              },
              processedWeight: {
                type: Sequelize.FLOAT,
                allowNull: true
              },
              timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
              }
            }, {
              timestamps: false,
              // Disable Sequelize's automatic createdAt/updatedAt
              tableName: 'weight_logs'
            }));

          case 2:
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
            return regeneratorRuntime.awrap(queryInterface.dropTable('weight_logs'));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};