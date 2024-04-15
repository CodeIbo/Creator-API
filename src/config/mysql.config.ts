import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { development, test, production } from "@db/config/config-app";
import { appState } from "@src/helpers/appState.helper";

dotenv.config();

const sequalizeDB = new Sequelize(
  String(process.env.DB_NAME),
  String(process.env.DB_USER),
  String(process.env.DB_PASSWORD),
  appState(development, production, test)
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
