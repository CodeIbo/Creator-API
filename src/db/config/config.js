/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node/register");
require("dotenv").config();

const config = require(`./config-app.${process.env.NODE_ENV === "development" ? "ts" : "js"}`);

const development = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...config.development,
};

const test = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...config.test,
};
const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...config.production,
};

module.exports = { development, test, production };
