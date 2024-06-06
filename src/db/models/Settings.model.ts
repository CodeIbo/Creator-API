import { type timeStamp } from "@src/models/timestamp.model";
import { Table, Column, Model, DataType, UpdatedAt, CreatedAt } from "sequelize-typescript";

export interface SettingsAttributes extends timeStamp {
  readonly id: string;
  company_name: string;
  logo: string;
  logo_alt: string;
  meta_data_title_global: string;
  meta_data_description_global: string;
  keywords_global: string;
  meta_data_suffix_global: string;
}

export type SettingsUpdateAttributes = Partial<SettingsAttributes>;

@Table({
  timestamps: false,
  tableName: "settings",
  modelName: "Settings",
})
export default class Settings extends Model<SettingsAttributes, SettingsUpdateAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare company_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare logo: string;

  @Column({
    type: DataType.STRING,
  })
  declare logo_alt: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_title_global: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_description_global: string;

  @Column({
    type: DataType.STRING,
  })
  declare keywords_global: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_suffix_global: string;

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
