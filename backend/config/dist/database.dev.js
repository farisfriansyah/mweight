"use strict";

var _require = require('sequelize'),
    Sequelize = _require.Sequelize;

var sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false // Menonaktifkan log query untuk menjaga kebersihan

});
module.exports = sequelize;