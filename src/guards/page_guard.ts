import { type pagePostObject, type updatePageObject } from "@src/models/page.model";
import _ from "lodash";

const verifyPageKeys = (unkownObject: Record<string, any>) => {
  return _.keys(unkownObject).every(
    (key) =>
      key === "page_name" ||
      key === "page_content" ||
      key === "meta_data_title" ||
      key === "meta_data_description" ||
      key === "page_url"
  );
};

export function isNewPageObject(obj: Record<string, any>): obj is pagePostObject {
  return (
    _.isString(obj.page_name) &&
    _.isString(obj.page_content) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.page_url) &&
    verifyPageKeys(obj)
  );
}

export function isUpdatePageObject(obj: any): obj is updatePageObject {
  return (
    (_.isString(obj.page_name) ||
      _.isString(obj.page_content) ||
      _.isString(obj.meta_data_title) ||
      _.isString(obj.meta_data_description) ||
      _.isString(obj.page_url)) &&
    verifyPageKeys(obj)
  );
}
