import { type QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      queryInterface
        .createTable("ui_settings", {
          id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("(uuid())"),
            unique: true,
          },
          element_key: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          element_value: {
            type: DataTypes.STRING,
          },
          element_type: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          element_css: {
            type: DataTypes.STRING,
          },
          created_at: {
            type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL",
            defaultValue: () => new Date(),
          },
          updated_at: {
            type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) NOT NULL",
            defaultValue: () => new Date(),
          },
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
