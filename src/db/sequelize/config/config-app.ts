import dotenv from "dotenv";
import { type ModelCtor } from "sequelize-typescript";
import { type Dialect } from "sequelize";
import models from "../../../db/sequelize/models/index";
// https://github.com/willjw3/sequelize-typescript-tutorial
dotenv.config();

export const development = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialect: "mysql" as Dialect,
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
};

export const test = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
  dialect: "mysql" as Dialect,
  storage: ":memory:",
};

export const production = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialect: "mysql" as Dialect,
  // zle
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
};
