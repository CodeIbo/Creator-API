import { type QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import("sequelize-cli").Migration} */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      queryInterface
        .createTable("settings", {
          id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("(uuid())"),
            unique: true,
          },
          company_name: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          logo: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          logo_alt: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          meta_data_title_global: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          meta_data_description_global: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          keywords_global: {
            type: DataTypes.STRING,
            defaultValue: null,
          },
          meta_data_suffix_global: {
            type: DataTypes.STRING,
            defaultValue: null,
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
