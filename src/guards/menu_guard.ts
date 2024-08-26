import _ from "lodash";

import Menu, { type MenuUpdateAttributes, type MenuCreationAttributes } from "@sequelize/models/Menu.model";
import { keysFilter } from "@helpers/key.helper";

const verifyMenuKeys = (unkownObject: Record<string, any>, isNew: boolean) => {
  const menuKeys = keysFilter(Menu, [
    "url_id",
    "menu_order",
    "label",
    "parent_id",
    "scroll_target",
    "type",
    "external_url",
    "internal_url",
    "target_blank",
  ]);
  if (isNew) {
    return menuKeys.every((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  } else {
    return menuKeys.some((key) => {
      return Object.prototype.hasOwnProperty.call(unkownObject, key);
    });
  }
};

export function isNewMenuObject(obj: Record<string, any>): obj is MenuCreationAttributes {
  return (
    verifyMenuKeys(obj, true) &&
    _.isNumber(obj.menu_order) &&
    _.isString(obj.label) &&
    _.isString(obj.type) &&
    _.isBoolean(obj.target_blank) &&
    (_.isNull(obj.url_id) || _.isString(obj.url_id)) &&
    (_.isNull(obj.internal_url) || _.isString(obj.internal_url)) &&
    (_.isNull(obj.external_url) || _.isString(obj.external_url)) &&
    (_.isNull(obj.parent_id) || _.isString(obj.parent_id)) &&
    (_.isNull(obj.scroll_target) || _.isString(obj.scroll_target))
  );
}

export function isUpdatedMenuObject(obj: Record<string, any>): obj is MenuUpdateAttributes {
  return (
    verifyMenuKeys(obj, false) &&
    (_.isString(obj.url_id) ||
      _.isNull(obj.url_id) ||
      _.isNumber(obj.menu_order) ||
      _.isString(obj.label) ||
      _.isNull(obj.parent_id) ||
      _.isString(obj.parent_id) ||
      _.isString(obj.scroll_target) ||
      _.isNull(obj.scroll_target) ||
      _.isString(obj.type) ||
      _.isString(obj.internal_url) ||
      _.isString(obj.external_url) ||
      _.isBoolean(obj.target_blank))
  );
}
