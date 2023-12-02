import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import Urls from "./Urls.model";
import Podcasts from "./Podcasts.model";

interface EpisodeAttributes {
  id: string;
  blog_key: string;
  author: string;
  article_content: string;
  photo_url: string;
  date: string;
}

type EpisodeCreationAttributes = EpisodeAttributes;

@Table({
  timestamps: false,
  tableName: "episodes",
  modelName: "Episodes",
})
class Episodes extends Model<EpisodeAttributes, EpisodeCreationAttributes> {
  @ForeignKey(() => Urls)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    unique: true,
  })
  declare id: string;

  @ForeignKey(() => Podcasts)
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
    type: DataType.STRING,
  })
  declare tags: string;
}

export default Episodes;
