import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";
import fs from "fs";

interface ImageAttributes {
  id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  mine_type: string;
  size: number;
  created_at: string;
}

export type ImageCreationAttributes = Omit<ImageAttributes, "created_at" | "id">;

export type ImageUpdatenAttributes = Partial<ImageCreationAttributes>;

@Table({
  timestamps: false,
  tableName: "images",
  modelName: "Images",
  hooks: {
    beforeDestroy: async (instance: Images) => {
      try {
        fs.unlinkSync(instance.file_path);
      } catch (err) {
        console.error("Failed to delete file", err);
        throw err;
      }
    },
  },
})
class Images extends Model<ImageAttributes, ImageCreationAttributes> {
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
  declare file_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare original_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare file_path: string;

  @Column({
    type: DataType.STRING,
  })
  declare mine_type: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare size: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare created_at: Date;
}

export default Images;
