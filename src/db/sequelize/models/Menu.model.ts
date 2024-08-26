import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, HasMany, ForeignKey } from "sequelize-typescript";
import Urls from "./Urls.model";

export interface MenuAttributes {
  id: string;
  url_id: string | null;
  menu_order: number;
  label: string;
  parent_id: string | null;
  scroll_target: string | null;
  type: "parent" | "internal" | "external" | "url";
  external_url: string | null;
  internal_url: string | null;
  target_blank: 0 | 1;
  created_at: string;
  updated_at: string;
}

export type MenuCreationAttributes = Omit<MenuAttributes, "created_at" | "updated_at" | "id">;

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
})
class Menu extends Model<MenuAttributes, MenuCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => Urls)
  @Column({
    type: DataType.STRING,
  })
  declare url_id: string | null;

  @Column({
    type: DataType.NUMBER,
  })
  declare menu_order: number;

  @Column({
    type: DataType.STRING,
  })
  declare label: string;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.STRING,
  })
  declare parent_id: string;

  @Column({
    type: DataType.STRING,
  })
  declare scroll_target: string;

  @Column({
    type: DataType.ENUM("parent", "internal", "external", "url"),
    allowNull: false,
  })
  declare type: "parent" | "internal" | "external" | "url";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare external_url: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare internal_url: string | null;

  @Column({
    type: DataType.TINYINT({ length: 1 }),
    defaultValue: 0,
    allowNull: false,
  })
  declare target_blank: boolean;

  @CreatedAt
  @Column({
    type: DataType.STRING,
  })
  declare created_at: string;

  @UpdatedAt
  @Column({
    type: DataType.STRING,
  })
  declare updated_at: string;

  @HasMany(() => Menu, { foreignKey: { name: "parent_id" }, onDelete: "CASCADE" })
  children: Menu[] | undefined;
}

export default Menu;
