import _ from "lodash";

const USER_QUERY = {
  SELECT_USERS: "SELECT * FROM users ORDER BY created_at DESC LIMIT 100",
  SELECT_USER: (key: string) => {
    return `SELECT * FROM users WHERE ${key} = ? LIMIT 1`;
  },
  CREATE_USER: "INSERT INTO users(nick_name, email, user_password, access_lvl) VALUES (?, ?, ?, ?)",
  UPDATE_USER: (bodyRequest: Record<string, any>) => {
    const keysToUpdate: string[] = [];
    _.forEach(bodyRequest, (_value, key) => {
      keysToUpdate.push(` ${key}`);
    });
    let sqlString = keysToUpdate.join(" = ?,");
    sqlString += " = ?";
    return `UPDATE users SET${sqlString} WHERE id = ?`;
  },
  DELETE_USER: "DELETE FROM users WHERE id = ?",
};

export default USER_QUERY;
