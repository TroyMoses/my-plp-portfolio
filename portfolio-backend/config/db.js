const config = require('./env');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

let db;

if (config.database.dialect === 'mysql') {
  // MySQL connection
  db = {
    async connect() {
      const connection = await mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        port: config.database.port
      });
      
      // Initialize tables if they don't exist
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      return connection;
    },
    getConnection() {
      return mysql.createPool(config.database);
    }
  };
} else {
  // MongoDB connection
  db = {
    async connect() {
      try {
        await mongoose.connect(config.database.uri, config.database.options);
        console.log('MongoDB connected successfully');
        
        // Set up Mongoose models
        require('../models/subscriber');
        require('../models/contact');
        
        return mongoose.connection;
      } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
      }
    },
    getConnection() {
      return mongoose.connection;
    }
  };
}

module.exports = db;