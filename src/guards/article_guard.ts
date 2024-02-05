import _ from "lodash";
import { keysFilter } from "@src/helpers/keysFilter";
import Articles, { type ArticlesCreationAttributes, type ArticlesUpdatenAttributes } from "@db/models/Articles.model";
import { isValidDate } from "@src/helpers/isValidDate";

const articleNewKeys = keysFilter(Articles, ["id", "created_at"], false);
const articleUpdateKeys = keysFilter(Articles, ["id", "created_at", "blog_key"], false);

const verifyArticleKeys = (
  unknownObject: Record<string, any>,
  allowedKeys: string[],
  isUpdate: boolean = false
): boolean => {
  const objectKeys = Object.keys(unknownObject);
  if (!isUpdate) {
    return allowedKeys.every((key) => objectKeys.includes(key));
  }
  return objectKeys.every((key) => allowedKeys.includes(key)) && objectKeys.length > 0;
};

export function isNewArticleObject(obj: Record<string, any>): obj is ArticlesCreationAttributes {
  if (!verifyArticleKeys(obj, articleNewKeys)) return false;
  return (
    _.isString(obj.url) &&
    _.isString(obj.blog_key) &&
    _.isString(obj.author) &&
    _.isString(obj.article_content) &&
    _.isString(obj.photo_url) &&
    isValidDate(obj.date) &&
    _.isString(obj.meta_data_title) &&
    _.isString(obj.meta_data_description) &&
    _.isString(obj.article_title) &&
    _.isString(obj.lead) &&
    _.isArray(obj.post_tags) &&
    obj.post_tags.every(_.isString)
  );
}

export function isUpdateArticleObject(obj: Record<string, any>): obj is ArticlesUpdatenAttributes {
  if (!verifyArticleKeys(obj, articleUpdateKeys, true)) return false;
  return (
    _.isString(obj.url) ||
    _.isString(obj.author) ||
    _.isString(obj.article_content) ||
    _.isString(obj.photo_url) ||
    isValidDate(obj.date) ||
    _.isString(obj.meta_data_title) ||
    _.isString(obj.meta_data_description) ||
    _.isString(obj.article_title) ||
    _.isString(obj.lead) ||
    (_.isArray(obj.post_tags) && obj.post_tags.every(_.isString))
  );
}
