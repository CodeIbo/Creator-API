import _ from "lodash";
import { keysFilter, keyVerificator } from "@helpers/key.helper";
import Articles, {
  type ArticlesCreationAttributes,
  type ArticlesUpdatenAttributes,
} from "@sequelize/models/Articles.model";
import { isValidDate } from "@helpers/date.helper";

const articleNewKeys = keysFilter(Articles, ["id", "created_at"], false);
const articleUpdateKeys = keysFilter(Articles, ["id", "created_at", "blog_key"], false);

export function isNewArticleObject(obj: Record<string, any>): obj is ArticlesCreationAttributes {
  if (!keyVerificator(obj, articleNewKeys)) return false;
  return (
    _.isString(obj.url) &&
    _.isString(obj.blog_key) &&
    _.isString(obj.author) &&
    _.isString(obj.article_content) &&
    _.isString(obj.photo_url) &&
    isValidDate(obj.date) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.keywords) &&
    _.isString(obj.article_title) &&
    _.isString(obj.lead) &&
    _.isArray(obj.post_tags) &&
    obj.post_tags.every(_.isString)
  );
}

export function isUpdateArticleObject(obj: Record<string, any>): obj is ArticlesUpdatenAttributes {
  if (!keyVerificator(obj, articleUpdateKeys, true)) return false;
  return (
    _.isString(obj.url) ||
    _.isString(obj.author) ||
    _.isString(obj.article_content) ||
    _.isString(obj.photo_url) ||
    isValidDate(obj.date) ||
    _.isString(obj.meta_data_title) ||
    _.isString(obj.meta_data_description) ||
    _.isString(obj.keywords) ||
    _.isString(obj.article_title) ||
    _.isString(obj.lead) ||
    (_.isArray(obj.post_tags) && obj.post_tags.every(_.isString))
  );
}
