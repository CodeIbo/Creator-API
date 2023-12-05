import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";
import type Meta from "@src/models/meta.model";

interface ArticlesAttributes extends Meta {
  id: string;
  url: string;
  blog_key: string;
  author: string;
  article_content: string;
  photo_url: string;
  date: Date;
}

type ArticlesCreationAttributes = Omit<ArticlesAttributes, "id">;

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
}

export default Articles;
