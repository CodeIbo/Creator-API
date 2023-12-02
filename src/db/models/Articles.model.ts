import { Table, Column, Model, DataType } from "sequelize-typescript";

interface ArticlesAttributes {
  id: string;
  blog_key: string;
  author: string;
  article_content: string;
  photo_url: string;
  date: string;
}

type ArticlesCreationAttributes = ArticlesAttributes;

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
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare blog_key: string;

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
}

export default Articles;
