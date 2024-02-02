import { Table, Column, Model, DataType, CreatedAt } from "sequelize-typescript";

export interface UserAttributes {
  id: string;
  email: string;
  nick_name: string;
  user_password: string;
  access_lvl: string;
  refresh_token: string;
  created_at: string;
}

export type UserCreationAttributes = Omit<UserAttributes, "id" | "created_at" | "refresh_token">;

export type userUpdateAttributes = Partial<UserCreationAttributes>;

export type userLoginAttributes = Pick<UserAttributes, "email" | "user_password">;

@Table({
  timestamps: false,
  tableName: "users",
  modelName: "Users",
})
class Users extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
  })
  declare user_password: string;

  @Column({
    type: DataType.STRING,
  })
  declare access_lvl: string;

  @Column({
    type: DataType.STRING,
  })
  declare nick_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare refresh_token: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare created_at: Date;
}

export default Users;
