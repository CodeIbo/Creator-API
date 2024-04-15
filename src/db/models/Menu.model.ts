import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";

interface MenuAttributes {
  id: string;
  url_id: string;
  menu_order: number;
  label: string;
  parent_id: string | null;
  created_at: string;
}

export type MenuCreationAttributes = Omit<MenuAttributes, "created_at" | "id">;

export type MenuUpdateAttributes = Partial<Omit<MenuCreationAttributes, "url_id">>;

export interface MenuSortAtributes {
  id: string;
  menu_order: number;
  [key: string]: any;
}

@Table({
  timestamps: false,
  tableName: "menu",
  modelName: "Menu",
  hooks: {
    beforeUpdate: async (instance: Menu) => {
      if (instance.menu_order === instance.previous("menu_order")) {
        const promiseRejection = await Promise.reject(new Error("Duplicated"));
        return promiseRejection;
      }
    },
  },
})
class Menu extends Model<MenuAttributes, MenuCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare url_id: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare menu_order: number;

  @Column({
    type: DataType.STRING,
  })
  declare label: string;

  @Column({
    type: DataType.STRING,
  })
  declare parent_id: string;

  @CreatedAt
  @Column({
    type: DataType.STRING,
  })
  declare created_at: string;
}

export default Menu;
