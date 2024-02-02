import _ from "lodash";

export const keysFilter = (classModel: any, keyArray: string[], includeArray: boolean = true) => {
  return _.keys(classModel.getAttributes()).filter((key) => {
    return includeArray ? keyArray.includes(key) : !keyArray.includes(key);
  });
};
