import { type updateBlogPostObject } from "@src/models/blog.model";
import _ from "lodash";

const BLOG_POST_QUERY = {
  SELECT_BLOG_POSTS: "SELECT * FROM blog ORDER BY created_at DESC LIMIT 100",
  SELECT_BLOG_POST: "SELECT * FROM blog WHERE id = ?",
  CREATE_BLOG_POST:
    "INSERT INTO blog(post_name, post_content, meta_data_title, meta_data_description, post_url, post_author, post_tags, publication_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  UPDATE_BLOG_POST: (bodyRequest: updateBlogPostObject) => {
    const keysToUpdate: string[] = [];
    _.forEach(bodyRequest, (_value, key) => {
      keysToUpdate.push(` ${key}`);
    });
    let sqlString = keysToUpdate.join(" = ?,");
    sqlString += " = ?";
    return `UPDATE blog SET${sqlString} WHERE id = ?`;
  },
  DELETE_BLOG_POST: "DELETE FROM blog WHERE id = ?",
};

export default BLOG_POST_QUERY;
