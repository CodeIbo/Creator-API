import dotenv from "dotenv";
import Users from "@db/models/Users.model";
import { encryptPassword } from "@controllers/password_controller";
import _ from "lodash";

dotenv.config();

const pswrd = process.env.SUPERADMIN_INITIAL_PASSWORD;
if (!_.isString(pswrd)) {
  throw Error("Setup ENV");
}
encryptPassword(pswrd)
  .then((data) => {
    if (_.isString(data)) {
      Users.create({
        email: "owner@test.com",
        user_password: data,
        nick_name: "Master",
        access_lvl: "Owner",
      }).catch((err) => {
        console.log(err);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
