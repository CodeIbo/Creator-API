import dotenv from "dotenv";
import { type Dialect } from "sequelize";
import { type ModelCtor } from "sequelize-typescript";
import models from "../../../db/sequelize/models/index";
// https://github.com/willjw3/sequelize-typescript-tutorial
dotenv.config();

export const development = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
};

export const test = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
  storage: ":memory:",
};

export const production = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_EXTERNAL_PORT),
  dialect: "mysql" as Dialect,
  database: process.env.DB_NAME,
  pool: {
    max: Number(process.env.DB_CONNECTION_LIMIT),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // zle
  models: models.map((model) => model as ModelCtor<any>) as ModelCtor[] | string[],
};
