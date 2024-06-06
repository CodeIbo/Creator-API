import { type QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Seeders} */

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface
      .bulkInsert("settings", [
        {
          company_name: "Example Company",
          meta_data_title_global: "Example Data Title",
          meta_data_description_global: "Example Meta Data",
          keywords_global: "example, page",
          meta_data_suffix_global: "Example Company",
        },
      ])
      .catch((err) => {
        console.log(err);
      });
  },
};
