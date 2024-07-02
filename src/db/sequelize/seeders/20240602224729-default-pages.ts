import { type QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Seeders} */

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("urls", [
      {
        url: "",
        page_category: "page",
        name: "Home Page",
        meta_data_title: "Home Page Title",
        meta_data_description: "Home Page Description",
        keywords: "Home Page Keywords",
      },
    ]);
  },
};
