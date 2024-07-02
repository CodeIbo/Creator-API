import _ from "lodash";

import { keyVerificator, keysFilter } from "@helpers/key.helper";
import UISettings, { type UISettingsAttributes } from "@sequelize/models/UISettings.model";

const uiSettingsKeys = keysFilter(UISettings, ["id", "created_at", "updated_at"], false);

export function isUISettingsMediaObject(obj: any): obj is UISettingsAttributes {
  if (!keyVerificator(obj, uiSettingsKeys, true)) return false;
  return _.isString(obj.element_value) || _.isString(obj.element_css);
}
