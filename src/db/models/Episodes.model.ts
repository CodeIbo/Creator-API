import type Meta from "@src/models/meta.model";
import { Table, Column, Model, DataType } from "sequelize-typescript";

interface EpisodeAttributes extends Meta {
  id: string;
  episode_title: string;
  episode_content: string;
  announcement_url: string;
  date: Date;
  author: string;
  tags: string[];
  podcast_key: string;
}

export type EpisodeCreationAttributes = EpisodeAttributes;

export type EpisodeUpdatenAttributes = Partial<Omit<EpisodeCreationAttributes, "podcast_key">>;

@Table({
  timestamps: false,
  tableName: "episodes",
  modelName: "Episodes",
})
class Episodes extends Model<EpisodeAttributes, EpisodeCreationAttributes> {
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
  declare podcast_key: string;

  @Column({
    type: DataType.STRING,
  })
  declare author: string;

  @Column({
    type: DataType.TEXT("medium"),
  })
  declare episode_content: string;

  @Column({
    type: DataType.STRING,
  })
  declare announcement_url: string;

  @Column({
    type: DataType.DATE,
  })
  declare date: Date;

  @Column({
    type: DataType.JSON,
  })
  declare tags: string[];

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_title: string;

  @Column({
    type: DataType.STRING,
  })
  declare meta_data_description: string;

  @Column({
    type: DataType.STRING,
  })
  declare keywords: string;
}

export default Episodes;
