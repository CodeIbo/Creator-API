import { type MenuAttributes } from "@db/sequelize/models/Menu.model";

export interface MenuWithChildren extends MenuAttributes {
  children?: MenuAttributes[];
}

export const structureMenu = (arr: MenuWithChildren[], itemID: string | null = null): MenuWithChildren[] => {
  return arr
    .filter((item) => item.parent_id === itemID)
    .sort((a, b) => a.menu_order - b.menu_order)
    .map((item) => ({
      ...item,
      children: structureMenu(arr, item.id),
    }));
};

export const flattenMenu = (items: MenuWithChildren[]): MenuWithChildren[] => {
  let result: MenuWithChildren[] = [];
  items.forEach((item) => {
    const { children, ...rest } = item;
    result.push({
      ...rest,
    } satisfies MenuWithChildren);
    if (children && children.length > 0) {
      result = result.concat(flattenMenu(children));
    }
  });
  return result as MenuAttributes[];
};
