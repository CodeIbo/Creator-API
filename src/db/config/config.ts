import dotenv from "dotenv";
import { type Dialect } from "sequelize/types/sequelize";
import * as path from "path";
// https://github.com/willjw3/sequelize-typescript-tutorial
dotenv.config();

export const development = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_HOST,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [path.join(__dirname, "../models/*.model.ts")],
};

export const test = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_HOST,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: [path.join(__dirname, "../models/*.model.ts")],
};
export const production = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_HOST,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  models: [path.join(__dirname, "../models/*.model.js")],
};
