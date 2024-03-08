import dotenv from "dotenv";
import { type Dialect } from "sequelize/types/sequelize";
// https://github.com/willjw3/sequelize-typescript-tutorial
dotenv.config();

export const development = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_INTERNAL_PORT),
  dialect: "mysql" as Dialect,
};
export const test = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_INTERNAL_PORT),
  dialect: "mysql" as Dialect,
};
export const production = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_INTERNAL_PORT),
  dialect: "mysql" as Dialect,
};
