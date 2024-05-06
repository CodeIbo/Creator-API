import { type QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Seeders} */
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("social_media", [
      {
        name: "facebook",
        icon: "facebook",
      },
      {
        name: "instagram",
        icon: "instagram",
      },
      {
        name: "linkedin",
        icon: "linkedin",
      },
      {
        name: "tiktok",
        icon: "tiktok",
      },
      {
        name: "x",
        icon: "x",
      },
      {
        name: "youtube",
        icon: "youtube",
      },
      {
        name: "spotify",
        icon: "spotify",
      },
    ]);
  },
};
