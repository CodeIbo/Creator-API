import mysql, { type MysqlError } from "mysql";
import dotenv from "dotenv";

dotenv.config();
const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
});

const checkConnection = () => {
  database.getConnection((err: MysqlError, connection) => {
    if (err !== null) {
      console.error("Error connecting to MySQL:", err);
    }
    console.log("Connected to MySQL.");
    connection.release();
  });
};
checkConnection();

export default database;
