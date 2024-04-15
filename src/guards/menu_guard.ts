import Menu, { type MenuUpdateAttributes, type MenuCreationAttributes } from "@db/models/Menu.model";
import { keysFilter } from "@src/helpers/key.helper";
import _ from "lodash";

const verifyMenuKeys = (unkownObject: Record<string, any>, isNew: boolean) => {
  const menuKeys = keysFilter(Menu, ["url_id", "menu_order", "label", "parent_id"]);
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
    _.isString(obj.url_id) &&
    _.isNumber(obj.menu_order) &&
    _.isString(obj.label) &&
    (_.isNull(obj.parent_id) || _.isString(obj.parent_id))
  );
}

export function isUpdatedMenuObject(obj: Record<string, any>): obj is MenuUpdateAttributes {
  return (
    verifyMenuKeys(obj, false) &&
    (_.isString(obj.url_id) ||
      _.isNumber(obj.menu_order) ||
      _.isString(obj.label) ||
      _.isNull(obj.parent_id) ||
      _.isString(obj.parent_id))
  );
}
