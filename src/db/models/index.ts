import { Sequelize } from "sequelize-typescript";
import * as path from "path";

const sequelize = new Sequelize({
  models: [path.join(__dirname, "/models/**/*.model.ts")],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf(".model")) === member.toLowerCase();
  },
});

// https://github.com/sequelize/sequelize-typescript#one-to-one
// https://github.com/sequelize/sequelize-typescript/issues/858

export default sequelize;
