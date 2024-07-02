import dotenv from "dotenv";
import { type QueryInterface } from "sequelize";
import _ from "lodash";
import { encryptPassword } from "../../../controllers/password_controller";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    dotenv.config();

    const pswrd = process.env.SUPERADMIN_INITIAL_PASSWORD;
    if (!_.isString(pswrd)) return new Error("Setup ENV");
    encryptPassword(pswrd)
      .then((pswd: any) => {
        if (!_.isString(pswd)) {
          console.log(pswd);
          return;
        }
        queryInterface
          .bulkInsert("users", [
            {
              email: "owner@test.com",
              user_password: pswd,
              nick_name: "Master",
              access_lvl: "Owner",
            },
          ])
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err: any) => {
        console.log(err);
      });
  },
};
