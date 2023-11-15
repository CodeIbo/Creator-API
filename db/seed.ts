import dotenv from "dotenv";
import mysql from "mysql";
import USER_QUERY from "@db/query/users_query";
import PAGES_QUERY from "@db/query/pages_query";
import { encryptPassword } from "@controllers/password_controller";
import _ from "lodash";

dotenv.config();

const database = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

database.connect((callback) => {
  console.log(callback);
});

const pswrd = process.env.SUPERADMIN_INITIAL_PASSWORD;
if (!_.isString(pswrd)) {
  throw Error("Setup ENV");
}

encryptPassword(pswrd)
  .then((data) => {
    database.query(USER_QUERY.CREATE_USER, ["Tester", "owner@test.com", data, "owner"], (err) => {
      if (err != null) {
        throw err;
      }
    });

    database.query(PAGES_QUERY.CREATE_PAGE, ["Home", "<h1>Home</h1>", "Home title", "Home description", "/"], (err) => {
      if (err != null) {
        throw err;
      }
    });
    database.query(
      PAGES_QUERY.CREATE_PAGE,
      ["About Us", "<h1>About Us</h1>", "About Us title", "About Us description", "/about-us"],
      (err) => {
        if (err != null) {
          throw err;
        }
      }
    );
  })
  .then(() => {
    database.end();
    console.log("Migration Success");
  })
  .catch((err) => {
    console.log(err);
  });

// zabezpieczyć przed mnożeniem się seeedu

// stworzenie klasy obsługującej database
