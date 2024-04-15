import _ from "lodash";
import { isNewUrlObject, isUpdateUrlObject } from "./url_guard";
import { type UrlsCreationAttributes } from "@db/models/Urls.model";
import { type PageUpdateAttributes, type PageCreationAttributes } from "@db/models/Pages.model";

const verifyPageKeys = (unkownObject: Record<string, any>) => {
  return _.keys(unkownObject).includes("page_content");
};

export function isNewPageObject(obj: Record<string, any>): obj is PageCreationAttributes & UrlsCreationAttributes {
  return verifyPageKeys(obj) && _.isString(obj.page_content) && isNewUrlObject(obj);
}

export function isUpdatePageObject(obj: Record<string, any>): obj is PageUpdateAttributes & UrlsCreationAttributes {
  return isUpdateUrlObject(obj) || (verifyPageKeys(obj) && _.isString(obj.page_content));
}
