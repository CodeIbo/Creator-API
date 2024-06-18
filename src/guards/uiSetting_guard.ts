import UISettings, { type UISettingsAttributes } from "@db/models/UISettings.model";
import { keyVerificator, keysFilter } from "@src/helpers/key.helper";
import _ from "lodash";

const uiSettingsKeys = keysFilter(UISettings, ["id", "created_at", "updated_at"], false);

export function isUISettingsMediaObject(obj: any): obj is UISettingsAttributes {
  if (!keyVerificator(obj, uiSettingsKeys, true)) return false;
  return _.isString(obj.element_value) || _.isString(obj.element_css);
}
