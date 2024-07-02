import _ from "lodash";

import { keysFilter, keyVerificator } from "@helpers/key.helper";
import { isValidDate } from "@helpers/date.helper";
import Episodes, {
  type EpisodeCreationAttributes,
  type EpisodeUpdatenAttributes,
} from "@sequelize/models/Episodes.model";

const episodeNewKeys = keysFilter(Episodes, ["id", "created_at"], false);
const episodeUpdateKeys = keysFilter(Episodes, ["id", "created_at", "podcast_key"], false);

export function isNewEpisodeObject(obj: Record<string, any>): obj is EpisodeCreationAttributes {
  if (!keyVerificator(obj, episodeNewKeys)) return false;
  return (
    _.isString(obj.url) &&
    _.isString(obj.podcast_key) &&
    _.isString(obj.author) &&
    _.isString(obj.episode_content) &&
    _.isString(obj.photo_url) &&
    _.isString(obj.announcement_url) &&
    isValidDate(obj.date) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.episode_title) &&
    _.isArray(obj.episode_tags) &&
    obj.episode_tags.every(_.isString)
  );
}

export function isUpdateEpisodeObject(obj: Record<string, any>): obj is EpisodeUpdatenAttributes {
  if (!keyVerificator(obj, episodeUpdateKeys, true)) return false;
  return (
    _.isString(obj.url) ||
    _.isString(obj.author) ||
    _.isString(obj.episode_content) ||
    _.isString(obj.photo_url) ||
    _.isString(obj.announcement_url) ||
    isValidDate(obj.date) ||
    _.isString(obj.meta_data_title) ||
    _.isString(obj.meta_data_description) ||
    _.isString(obj.episode_title) ||
    (_.isArray(obj.episode_tags) && obj.episode_tags.every(_.isString))
  );
}
