const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TcpConfig = sequelize.define('TcpConfig', {
  machineId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the weighing machine',
  },
  tcpHost: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'TCP host address for the machine',
  },
  tcpPort: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'TCP port for the machine',
  },
}, {
  tableName: 'tcp_configs',
  timestamps: true,
});

module.exports = TcpConfig;