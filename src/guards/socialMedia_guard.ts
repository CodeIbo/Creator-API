import SocialMedia, { type SocialMediaUpdateAttributes } from "@db/models/SocialMedia.model";
import { keyVerificator, keysFilter } from "@src/helpers/key.helper";
import _ from "lodash";

const socialMediaKeys = keysFilter(SocialMedia, ["id", "created_at", "updated_at"], false);

export function isUpdateSocialMediaObject(obj: any): obj is SocialMediaUpdateAttributes {
  if (!keyVerificator(obj, socialMediaKeys, true)) return false;
  return _.isString(obj.link) || _.isString(obj.title) || [0, 1].includes(obj.available);
}
