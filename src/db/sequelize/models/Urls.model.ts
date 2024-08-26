import { Table, Column, Model, DataType, CreatedAt, HasOne, HasMany } from "sequelize-typescript";
import Pages from "./Pages.model";
import Podcasts from "./Podcasts.model";
import Blogs from "./Blogs.model";
import type Meta from "@src/models/meta.model";
import Menu from "./Menu.model";

export type pageCategory = "page" | "blog" | "article" | "podcast" | "episode";

export interface UrlsAttributes extends Meta {
  id: string;
  url: string;
  page_category: pageCategory;
  name: string;
  created_at: string;
}

export type UrlsCreationAttributes = Omit<UrlsAttributes, "id" | "created_at">;

export type UrlsUpdateAttributes = Partial<UrlsCreationAttributes>;

@Table({
  tableName: "urls",
  modelName: "Urls",
  timestamps: false,
})
class Urls extends Model<UrlsAttributes, UrlsCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare url: string;

  @Column({
    type: DataType.STRING,
  })
  declare page_category: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_title: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_description: string;

  @Column({
    type: DataType.STRING,
  })
  declare keywords: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare created_at: Date;

  @HasOne(() => Pages, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare pageKey: Pages;

  @HasOne(() => Blogs, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare blogKey: Blogs;

  @HasOne(() => Podcasts, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare podcastKey: Podcasts;

  @HasMany(() => Menu, { foreignKey: { name: "url_id" }, onDelete: "CASCADE" })
  declare MenuKey: Menu;
}

export default Urls;
