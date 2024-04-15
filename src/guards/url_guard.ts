import _ from "lodash";
import Urls, { type UrlsUpdateAttributes, type UrlsCreationAttributes } from "@db/models/Urls.model";
import { keyVerificator, keysFilter } from "@src/helpers/key.helper";

const urlKeys = keysFilter(Urls, ["id", "created_at"], false);

export function isNewUrlObject(obj: Record<string, any>): obj is UrlsCreationAttributes {
  if (!keyVerificator(obj, urlKeys)) return false;
  return (
    _.isString(obj.url) &&
    _.isString(obj.name) &&
    _.isString(obj.page_category) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.keywords)
  );
}

export function isUpdateUrlObject(obj: Record<string, any>): obj is UrlsUpdateAttributes {
  if (!keyVerificator(obj, urlKeys, true)) return false;
  return (
    _.isString(obj.url) ||
    _.isString(obj.name) ||
    _.isString(obj.page_category) ||
    _.isString(obj.meta_data_title) ||
    _.isString(obj.meta_data_description) ||
    _.isString(obj.keywords)
  );
}
