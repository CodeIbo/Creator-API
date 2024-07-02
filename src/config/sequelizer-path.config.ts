// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const basePath = path.resolve(__dirname, "../db/sequelize");

module.exports = {
  paths: {
    config: path.join(basePath, "config", "config.js"),
    modelsPath: path.join(basePath, "models"),
    seedersPath: path.join(basePath, "seeders"),
    migrationsPath: path.join(basePath, "migrations"),
  },
};
