import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Episodes from "./Episodes.model";

@Table({
  timestamps: false,
  tableName: "podcasts",
  modelName: "Podcasts",
})
class Podcasts extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare podcast_title: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare podcast_key: string;

  @HasMany(() => Episodes, { foreignKey: { name: "podcast_key" }, onDelete: "CASCADE" })
  declare episodes: Episodes[];
}

export default Podcasts;
