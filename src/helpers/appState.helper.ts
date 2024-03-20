import dotenv from "dotenv";
dotenv.config();

export const appState = <T>(dev: T, prod: T, test: T) => {
  const state = process.env.NODE_ENV;
  switch (state) {
    case "development":
      return dev;
    case "production":
      return prod;

    case "test":
      return test;

    default:
      return dev;
  }
};
