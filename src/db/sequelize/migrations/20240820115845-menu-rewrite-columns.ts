import { type QueryInterface, DataTypes, Sequelize } from "sequelize";
/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.changeColumn("menu", "url_id", {
      type: DataTypes.STRING(),
      defaultValue: null,
    });
    await queryInterface.changeColumn("menu", "parent_id", {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("(uuid())"),
      allowNull: true,
    });

    await queryInterface.changeColumn("menu", "parent_id", {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("(uuid())"),
      references: {
        model: "menu",
        key: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("menu", "type", {
      type: DataTypes.ENUM("parent", "internal", "external", "url"),
      allowNull: false,
    });
    await queryInterface.addColumn("menu", "external_url", {
      type: DataTypes.STRING(),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("menu", "internal_url", {
      type: DataTypes.STRING(),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("menu", "target_blank", {
      type: DataTypes.TINYINT({ length: 1 }),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("menu", "updated_at", {
      type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) NOT NULL",
      defaultValue: () => new Date(),
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn("menu", "updated_at");
    await queryInterface.removeColumn("menu", "target_blank");
    await queryInterface.removeColumn("menu", "internal_url");
    await queryInterface.removeColumn("menu", "external_url");
    await queryInterface.removeColumn("menu", "type");
    await queryInterface.changeColumn("menu", "parent_id", {
      type: DataTypes.UUID,
      allowNull: true,
    });
    await queryInterface.changeColumn("menu", "url_id", {
      type: DataTypes.UUID,
      allowNull: false,
    });
  },
};
