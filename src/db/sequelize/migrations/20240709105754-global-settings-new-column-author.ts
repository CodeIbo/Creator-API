import { type QueryInterface, DataTypes } from "sequelize";
/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("settings", "meta_author_global", {
      type: DataTypes.STRING,
      defaultValue: null,
    });
  },
};
