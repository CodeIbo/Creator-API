import { type blogPostObject, type updateBlogPostObject } from "@src/models/blog.model";
import _ from "lodash";

const verifyBlogKeys = (unkownObject: Record<string, any>) => {
  return _.keys(unkownObject).every(
    (key) =>
      key === "post_name" ||
      key === "post_content" ||
      key === "meta_data_title" ||
      key === "meta_data_description" ||
      key === "post_url" ||
      key === "post_author" ||
      key === "post_tags" ||
      key === "publication_date"
  );
};

export function isNewBlogObject(obj: Record<string, any>): obj is blogPostObject {
  return (
    _.isString(obj.post_name) &&
    _.isString(obj.post_content) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.post_url) &&
    _.isString(obj.post_author) &&
    _.isArray(obj.post_tags) &&
    _.isDate(new Date(obj.publication_date)) &&
    verifyBlogKeys(obj)
  );
}

export function isUpdateBlogObject(obj: any): obj is updateBlogPostObject {
  return (
    (_.isString(obj.post_name) ||
      _.isString(obj.post_content) ||
      _.isString(obj.meta_data_title) ||
      _.isString(obj.meta_data_description) ||
      _.isString(obj.post_url) ||
      _.isString(obj.post_author) ||
      _.isArray(obj.post_tags) ||
      _.isDate(new Date(obj.publication_date))) &&
    verifyBlogKeys(obj)
  );
}
