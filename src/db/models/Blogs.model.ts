import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Articles from "./Articles.model";

interface BlogAttributes {
  id: string;
  blog_title: string;
  blog_key: string;
}

type BlogCreationAttributes = BlogAttributes;

@Table({
  timestamps: false,
  tableName: "blogs",
  modelName: "Blogs",
})
class Blogs extends Model<BlogAttributes, BlogCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare blog_title: string;

  @Column({
    type: DataType.STRING,
  })
  declare blog_key: string;

  @HasMany(() => Articles, { foreignKey: { name: "blog_key" }, onDelete: "CASCADE" })
  declare articles: Articles[];
}

export default Blogs;
