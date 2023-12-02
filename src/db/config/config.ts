import dotenv from "dotenv";
// https://github.com/willjw3/sequelize-typescript-tutorial
dotenv.config();

export const development = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "sqldb",
  dialect: "postgres",
};
export const test = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "sqldb",
  dialect: "mysql",
};
export const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "sqldb",
  dialect: "mysql",
};
