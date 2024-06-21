import _ from "lodash";
import { getUrlById, getUrlsByCategory } from "@controllers/url_controller";
import type Urls from "@db/models/Urls.model";
import { type pageCategory } from "@db/models/Urls.model";

interface ContentObject {
  id: string;
  get: (options?: { plain?: boolean; clone?: boolean }) => { id: string; [key: string]: any };
  [key: string]: any;
}

export async function mergeArraysWithUrls<T>(
  contentObjects: ContentObject[],
  category: pageCategory
): Promise<Array<T & Urls>> {
  return await getUrlsByCategory(category)
    .then((data) => {
      if (data.status) {
        const updatedContent = contentObjects.map((contentObject) => {
          const urlList = data.data.filter((url) => {
            return url.id === contentObject.id;
          });
          let updatedContentObject = contentObject.get();
          urlList.forEach((urlObj) => {
            updatedContentObject = _.defaults(updatedContentObject, urlObj.get());
          });
          return updatedContentObject;
        });

        return updatedContent;
      }
    })
    .catch((err) => err);
}

export async function mergeObjectWithUrl<T>(contentObject: ContentObject, id: string): Promise<T & Urls> {
  return await getUrlById(id)
    .then((data) => {
      if (data.status && data.data) {
        return _.defaults(contentObject.get(), data.data.get());
      }
    })
    .catch((err) => err);
}
