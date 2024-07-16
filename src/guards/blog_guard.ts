import _ from "lodash";

import { isNewUrlObject, isUpdateUrlObject } from "./url_guard";
import Blogs, { type BlogUpdateAttributes, type BlogCreationAttributes } from "@sequelize/models/Blogs.model";
import { type UrlsUpdateAttributes, type UrlsCreationAttributes } from "@sequelize/models/Urls.model";
import { keysFilter } from "@helpers/key.helper";

const verifyBlogKeys = (unkownObject: Record<string, any>, isNew: boolean) => {
  const blogKeys = keysFilter(Blogs, ["blog_title", "blog_key"]);
  if (isNew) {
    return blogKeys.every((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  } else {
    return blogKeys.some((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  }
};

export function isNewBlogObject(obj: Record<string, any>): obj is BlogCreationAttributes & UrlsCreationAttributes {
  return verifyBlogKeys(obj, true) && _.isString(obj.blog_title) && _.isString(obj.blog_key) && isNewUrlObject(obj);
}

export function isUpdateBlogObject(obj: any): obj is BlogUpdateAttributes & UrlsUpdateAttributes {
  return (
    isUpdateUrlObject(obj) || (verifyBlogKeys(obj, false) && (_.isString(obj.blog_title) || _.isString(obj.blog_key)))
  );
}
