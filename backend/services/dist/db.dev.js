"use strict";

var mysql = require('mysql2'); // Configure MySQL connection


var connection = mysql.createConnection({
  host: 'localhost',
  // Database host (if using XAMPP, this should be localhost)
  user: 'root',
  // Your MySQL username (by default it's root in XAMPP)
  password: '',
  // Your MySQL password (by default it's empty in XAMPP)
  database: 'mweigth',
  // Your database name
  port: 3306 // Default MySQL port

}); // Connect to the database

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }

  console.log('Connected to the database as ID ' + connection.threadId);
});
module.exports = connection;