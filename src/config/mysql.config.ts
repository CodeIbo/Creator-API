import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import * as path from "path";
import { development } from "@db/config/config";

dotenv.config();

const sequalizeDB = new Sequelize(
  String(process.env.DB_NAME),
  String(process.env.DB_USER),
  String(process.env.DB_PASSWORD),
  {
    host: development.host,
    port: development.port,
    dialect: development.dialect,
    database: development.database,
    pool: {
      max: Number(process.env.DB_CONNECTION_LIMIT),
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    models: [path.join(__dirname, "../db/models/*.model.ts")],
  }
);
const checkConnection = async () => {
  try {
    await sequalizeDB.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

checkConnection().catch((err) => {
  console.log(err);
});

export default sequalizeDB;
