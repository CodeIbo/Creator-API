import { type QueryInterface, DataTypes } from "sequelize";
/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("menu", "scroll_target", {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },
};
