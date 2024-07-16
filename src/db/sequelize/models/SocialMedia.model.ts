import { type timeStamp } from "@models/timestamp.model";
import { Table, Column, Model, DataType, UpdatedAt, CreatedAt } from "sequelize-typescript";

export interface SocialMediaAttributes extends timeStamp {
  readonly id: string;
  readonly name: string;
  order: number;
  available: 0 | 1;
  link: string | null;
  title: string | null;
  readonly icon: string;
}
export interface SocialMediaSortAtributes {
  id: string;
  order: number;
  [key: string]: any;
}

export type SocialMediaCreationAttributes = SocialMediaAttributes;

export type SocialMediaUpdateAttributes = Partial<SocialMediaCreationAttributes>;

@Table({
  timestamps: false,
  tableName: "social_media",
  modelName: "SocialMedia",
})
export default class SocialMedia extends Model<SocialMediaCreationAttributes, SocialMediaUpdateAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TINYINT({ length: 1 }),
    defaultValue: 0,
    allowNull: false,
  })
  declare available: number;

  @Column({
    type: DataType.NUMBER,
  })
  declare order: number;

  @Column({
    type: DataType.STRING,
  })
  declare link: string;

  @Column({
    type: DataType.STRING,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare icon: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_at",
  })
  declare updated_at: Date;
}
