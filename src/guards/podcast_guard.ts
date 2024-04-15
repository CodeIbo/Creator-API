import { keysFilter, keyVerificator } from "@src/helpers/key.helper";
import _ from "lodash";
import { isNewUrlObject, isUpdateUrlObject } from "./url_guard";
import { type UrlsUpdateAttributes, type UrlsCreationAttributes } from "@db/models/Urls.model";
import Podcasts, { type PodcastCreationAttributes, type PodcastUpdateAttributes } from "@db/models/Podcasts.model";

const podcastKeys = keysFilter(Podcasts, ["id", "created_at"], false);

export function isNewPodcastObject(
  obj: Record<string, any>
): obj is PodcastCreationAttributes & UrlsCreationAttributes {
  if (!keyVerificator(obj, podcastKeys)) return false;
  return _.isString(obj.podcast_title) && _.isString(obj.podcast_key) && isNewUrlObject(obj);
}

export function isUpdatePodcastObject(obj: any): obj is PodcastUpdateAttributes & UrlsUpdateAttributes {
  if (!keyVerificator(obj, podcastKeys, true)) return false;
  return isUpdateUrlObject(obj) || _.isString(obj.podcast_key) || _.isString(obj.podcast_key);
}
