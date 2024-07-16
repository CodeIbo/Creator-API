import _ from "lodash";

import { objectFilter } from "./object.helper";

export const keysFilter = (classModel: any, keyArray: string[], includeArray: boolean = true) => {
  return _.keys(classModel.getAttributes()).filter((key) => {
    return includeArray ? keyArray.includes(key) : !keyArray.includes(key);
  });
};

export const keyVerificator = (
  unknownObject: Record<string, any>,
  allowedKeys: string[],
  isUpdate: boolean = false
): boolean => {
  const filteredObject = objectFilter(unknownObject, allowedKeys);
  const objectKeys = Object.keys(filteredObject);
  if (!isUpdate) {
    return objectKeys.every((key) => allowedKeys.includes(key));
  }
  return objectKeys.every((key) => allowedKeys.includes(key)) && objectKeys.length > 0;
};
