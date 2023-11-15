export interface userPostObject {
  nick_name: string;
  email: string;
  user_password: string;
  access_lvl: string;
}

export type userLoginObject = Omit<userPostObject, "nick_name" | "access_lvl">;

export type updateUserObject = Partial<userPostObject>;

export interface userObject extends userPostObject {
  readonly id: string;
  readonly created_at: Date;
  refresh_token: string;
}
