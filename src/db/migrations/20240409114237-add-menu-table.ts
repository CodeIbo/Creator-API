import { type QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      queryInterface
        .createTable("menu", {
          id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("(uuid())"),
            unique: true,
          },
          url_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: "urls", key: "id" },
          },
          menu_order: {
            type: DataTypes.NUMBER,
            allowNull: false,
          },
          label: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          parent_id: {
            type: DataTypes.STRING,
          },
          created_at: {
            type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL",
            defaultValue: () => new Date(),
          },
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
