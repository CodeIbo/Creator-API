import { type updatePageObject } from "@src/models/page.model";
import _ from "lodash";

const PAGES_QUERY = {
  SELECT_PAGES: "SELECT * FROM pages ORDER BY created_at DESC LIMIT 100",
  SELECT_PAGE: "SELECT * FROM pages WHERE id = ?",
  CREATE_PAGE:
    "INSERT INTO pages(page_name, page_content, meta_data_title, meta_data_description, page_url) VALUES (?, ?, ?, ?, ?)",
  UPDATE_PAGE: (bodyRequest: updatePageObject) => {
    const keysToUpdate: string[] = [];
    _.forEach(bodyRequest, (_value, key) => {
      keysToUpdate.push(` ${key}`);
    });
    let sqlString = keysToUpdate.join(" = ?,");
    sqlString += " = ?";
    return `UPDATE pages SET${sqlString} WHERE id = ?`;
  },
  DELETE_PAGE: "DELETE FROM pages WHERE id = ?",
};

export default PAGES_QUERY;
