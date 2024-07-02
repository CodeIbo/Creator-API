import { type QueryInterface } from "sequelize";

/** @type {import("sequelize-cli").Seeders} */
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("social_media", [
      {
        name: "facebook",
        icon: "facebook",
        order: 0,
      },
      {
        name: "instagram",
        icon: "instagram",
        order: 1,
      },
      {
        name: "linkedin",
        icon: "linkedin",
        order: 2,
      },
      {
        name: "tiktok",
        icon: "tiktok",
        order: 3,
      },
      {
        name: "x",
        icon: "x",
        order: 4,
      },
      {
        name: "youtube",
        icon: "youtube",
        order: 5,
      },
      {
        name: "spotify",
        icon: "spotify",
        order: 6,
      },
    ]);
  },
};
