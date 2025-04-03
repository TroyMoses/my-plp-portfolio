require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const development = {
  database: {
    dialect: 'mysql',
    host: process.env.DEV_DB_HOST,
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    port: process.env.DEV_DB_PORT || 3306
  }
};

const production = {
  database: {
    dialect: 'mongodb',
    uri: process.env.PROD_DB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
};

const config = {
  development,
  production
};

module.exports = config[env];