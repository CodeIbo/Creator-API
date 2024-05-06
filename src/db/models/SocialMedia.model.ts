import { type timeStamp } from "@src/models/timestamp.model";
import { Table, Column, Model, DataType, AllowNull } from "sequelize-typescript";

export interface SocialMediaAttributes extends timeStamp {
  id: string;
  name: string;
  available: 0 | 1;
  link: string | null;
  title: string | null;
  icon: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export type SocialMediaCreationAttributes = Omit<SocialMediaAttributes, "id" | "created_at" | "updated_at">;

export type SocialMediaUpdateAttributes = Partial<SocialMediaCreationAttributes>;

@Table({
  timestamps: true,
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.TINYINT({ length: 1 }),
    defaultValue: 0,
  })
  declare available: number;

  @Column({
    type: DataType.STRING,
  })
  declare link: string;

  @Column({
    type: DataType.STRING,
  })
  declare title: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare icon: string;
}
