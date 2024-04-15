import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10).catch((err: Error) => {
    return err;
  });
};

export const comparePassword = async (password: string, hashedPasswordDB: string) => {
  return await bcrypt.compare(password, hashedPasswordDB).catch((err: Error) => {
    return err;
  });
};
