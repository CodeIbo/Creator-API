import { type timeStamp } from "@models/timestamp.model";
import { Table, Column, Model, DataType, UpdatedAt, CreatedAt } from "sequelize-typescript";

export interface UISettingsAttributes extends timeStamp {
  readonly id: string;
  element_key: string;
  element_value: string;
  element_type: string;
  element_css: string;
}

export type UISettingsCreationAttributes = UISettingsAttributes;

export type UISettingsUpdateAttributes = Partial<
  Omit<UISettingsCreationAttributes, "id" | "created_at" | "updated_at">
>;

@Table({
  timestamps: false,
  tableName: "ui_settings",
  modelName: "UISettings",
})
export default class UISettings extends Model<UISettingsCreationAttributes, UISettingsUpdateAttributes> {
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
  declare element_key: string;

  @Column({
    type: DataType.STRING,
  })
  declare element_value: string;

  @Column({
    type: DataType.STRING,
  })
  declare element_type: string;

  @Column({
    type: DataType.STRING,
  })
  declare element_css: string;

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
