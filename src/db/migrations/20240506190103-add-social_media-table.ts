import { type QueryInterface, DataTypes, Sequelize } from "sequelize";
/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      queryInterface
        .createTable(
          "social_media",
          {
            id: {
              primaryKey: true,
              type: DataTypes.UUID,
              defaultValue: Sequelize.literal("(uuid())"),
              allowNull: false,
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            available: {
              type: DataTypes.TINYINT({ length: 1 }),
              allowNull: false,
              defaultValue: 0,
            },
            link: {
              type: DataTypes.STRING,
            },
            title: {
              type: DataTypes.STRING,
            },
            icon: {
              type: DataTypes.STRING,
              unique: true,
              allowNull: false,
            },
            order: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            created_at: {
              type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL",
              defaultValue: () => new Date(),
            },
            updated_at: {
              type: "DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) NOT NULL",
              defaultValue: () => new Date(),
            },
          },
          { transaction }
        )
        .catch((err) => {
          console.log(err);
        });
    });
  },
};
