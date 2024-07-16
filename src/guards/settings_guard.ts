import _ from "lodash";

import Settings, { type SettingsUpdateAttributes } from "@sequelize/models/Settings.model";
import { keyVerificator, keysFilter } from "@helpers/key.helper";

const settingKeys = keysFilter(Settings, ["id", "created_at", "updated_at"], false);

export function isUpdateSettingsObject(obj: any): obj is SettingsUpdateAttributes {
  if (!keyVerificator(obj, settingKeys, true)) return false;

  return Object.values(obj).every((v) => _.isString(v));
}
