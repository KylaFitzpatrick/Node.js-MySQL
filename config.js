const dotenv = require('dotenv');
dotenv.config(); // make sure the .env file is at the root of your project
// mysql config
module.exports.databaseOptions = {

  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: process.env.SQL_USERNAME,
  // Your password
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
};

