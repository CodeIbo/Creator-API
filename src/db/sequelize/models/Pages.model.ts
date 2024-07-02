import { Table, Column, Model, DataType } from "sequelize-typescript";

export interface PageAttributes {
  id: string;
  page_content: string;
  page_type: string;
}

export type PageCreationAttributes = PageAttributes;

export type PageUpdateAttributes = Partial<PageCreationAttributes>;

@Table({
  timestamps: false,
  tableName: "pages",
  modelName: "Pages",
})
class Pages extends Model<PageAttributes, PageCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
  })
  declare id: string;

  @Column({
    type: DataType.TEXT("medium"),
    unique: true,
  })
  declare page_content: string;

  @Column({
    type: DataType.STRING,
  })
  declare page_type: string;
}

export default Pages;
