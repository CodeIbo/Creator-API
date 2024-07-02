import _ from "lodash";

import { keyVerificator, keysFilter } from "@helpers/key.helper";
import SocialMedia, { type SocialMediaUpdateAttributes } from "@sequelize/models/SocialMedia.model";

const socialMediaKeys = keysFilter(SocialMedia, ["id", "created_at", "updated_at"], false);

export function isUpdateSocialMediaObject(obj: any): obj is SocialMediaUpdateAttributes {
  if (!keyVerificator(obj, socialMediaKeys, true)) return false;
  return _.isString(obj.link) || _.isString(obj.title) || [0, 1].includes(obj.available);
}
