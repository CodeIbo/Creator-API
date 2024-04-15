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
            defaultValue: DataTypes.UUIDV4,
            unique: true,
          },
          url_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: "urls", key: "id" },
          },
          menu_order: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
