require("dotenv").config();
/**{
  "development": {
    "username": "sesac",
    "password": "1234",
    "database": "sesac",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
 */

const development = {
  username: process.env.DB_USERNAME,
  paswword: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: "mysql",
};
const test = {};
const production = {
  username: DB_PROD_PASSWORD,
  paswword: DB_PROD_DATABASE,
  database: DB_PROD_HOST,
  host: DB_PROD_USERNAME,
  dialect: "mysql",
};

module.exports = { development, production };
