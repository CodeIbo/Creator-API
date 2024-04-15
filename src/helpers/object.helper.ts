import _ from "lodash";

export const objectFilter = (unfliteredObject: Record<string, any>, keysToFilter: string[]) => {
  return _.pickBy(unfliteredObject, (v: any, k: string) => {
    return keysToFilter.includes(k);
  });
};
