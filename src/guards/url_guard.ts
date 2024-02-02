import _ from "lodash";
import Urls, { type UrlsUpdateAttributes, type UrlsCreationAttributes } from "@db/models/Urls.model";
import { keysFilter } from "@src/helpers/keysFilter";

const verifyUrlKeys = (unkownObject: Record<string, any>, isNew: boolean) => {
  const urlKeys = keysFilter(Urls, ["id", "created_at"], false);

  if (isNew) {
    return urlKeys.every((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  } else {
    return urlKeys.some((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  }
};

export function isNewUrlObject(obj: Record<string, any>): obj is UrlsCreationAttributes {
  return (
    _.isString(obj.url) &&
    _.isString(obj.name) &&
    _.isString(obj.page_category) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.keywords) &&
    verifyUrlKeys(obj, true)
  );
}

export function isUpdateUrlObject(obj: Record<string, any>): obj is UrlsUpdateAttributes {
  return (
    (_.isString(obj.url) ||
      _.isString(obj.name) ||
      _.isString(obj.page_category) ||
      _.isString(obj.meta_data_title) ||
      _.isString(obj.meta_data_description) ||
      _.isString(obj.keywords)) &&
    verifyUrlKeys(obj, false)
  );
}
