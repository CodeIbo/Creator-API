import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";
import type Meta from "@src/models/meta.model";

interface ArticlesAttributes extends Meta {
  id: string;
  url: string;
  blog_key: string;
  author: string;
  article_title: string;
  article_content: string;
  lead: string;
  post_tags: string[];
  photo_url: string;
  date: Date;
}

export type ArticlesCreationAttributes = Omit<ArticlesAttributes, "id">;

export type ArticlesUpdatenAttributes = Partial<Omit<ArticlesCreationAttributes, "blog_key">>;

@Table({
  timestamps: false,
  tableName: "articles",
  modelName: "Articles",
})
class Articles extends Model<ArticlesAttributes, ArticlesCreationAttributes> {
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
  declare blog_key: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare url: string;

  @Column({
    type: DataType.STRING,
  })
  declare author: string;

  @Column({
    type: DataType.TEXT("medium"),
  })
  declare article_title: string;

  @Column({
    type: DataType.TEXT("medium"),
  })
  declare lead: string;

  @Column({
    type: DataType.JSON,
  })
  declare post_tags: string[];

  @Column({
    type: DataType.TEXT("medium"),
  })
  declare article_content: string;

  @Column({
    type: DataType.STRING,
  })
  declare photo_url: string;

  @Column({
    type: DataType.DATE,
  })
  declare date: Date;

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
}

export default Articles;
