import { type userPostObject, type updateUserObject, type userLoginObject } from "@models/user.model";
import _ from "lodash";

const verifyUserKeys = (unkownObject: Record<string, any>) => {
  return _.keys(unkownObject).every(
    (key) => key === "nick_name" || key === "email" || key === "user_password" || key === "access_lvl"
  );
};

export function isNewUserObject(obj: Record<string, any>): obj is userPostObject {
  return (
    _.isString(obj.nick_name) &&
    _.isString(obj.email) &&
    _.isString(obj.user_password) &&
    _.isString(obj.access_lvl) &&
    verifyUserKeys(obj)
  );
}

export function isUpdateUserObject(obj: Record<string, any>): obj is updateUserObject {
  return (
    (_.isString(obj.nick_name) ||
      _.isString(obj.email) ||
      _.isString(obj.user_password) ||
      _.isString(obj.access_lvl)) &&
    verifyUserKeys(obj)
  );
}

export function isLoginUserObject(obj: Record<string, any>): obj is userLoginObject {
  return _.isString(obj.email) && _.isString(obj.user_password) && verifyUserKeys(obj);
}
