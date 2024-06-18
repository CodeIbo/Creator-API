import { type QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Seeders} */

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface
      .bulkInsert("ui_settings", [
        {
          element_key: "input_placeholder",
          element_value: "Search",
          element_type: "blog",
        },
        {
          element_key: "mins_read",
          element_value: "min read",
          element_type: "blog",
        },
        {
          element_key: "button_text",
          element_value: "Read more",
          element_type: "blog",
        },
        {
          element_key: "button_title",
          element_value: "Read more",
          element_type: "blog",
        },
        {
          element_key: "link_text",
          element_value: "Privacy Policy",
          element_type: "privacy_policy",
        },
        {
          element_key: "link_title",
          element_value: "Go to Privacy Policy",
          element_type: "privacy_policy",
        },
      ])
      .catch((err) => {
        console.log(err);
      });
  },
};
