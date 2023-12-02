import { Table, Column, Model, DataType, CreatedAt, HasOne } from "sequelize-typescript";
import Pages from "./Pages.model";
import Articles from "./Articles.model";
import Podcasts from "./Podcasts.model";
import Episodes from "./Episodes.model";
import Blogs from "./Blogs.model";

interface UrlsAttributes {
  id: string;
  url: string;
  page_category: string;
  name: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  created_at: string;
}

type UrlsCreationAttributes = Omit<UrlsAttributes, "id" | "created_at" | "refresh_token">;

@Table({
  tableName: "urls",
  modelName: "Urls",
  timestamps: false,
})
class Urls extends Model<UrlsAttributes, UrlsCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
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
  declare meta_title: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_description: string;

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
  declare random: Pages;

  @HasOne(() => Blogs, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare randomx: Blogs;

  @HasOne(() => Articles, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare randomd: Articles;

  @HasOne(() => Podcasts, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare randoms: Podcasts;

  @HasOne(() => Episodes, { foreignKey: { name: "id" }, onDelete: "CASCADE" })
  declare randomw: Episodes;
}

export default Urls;
