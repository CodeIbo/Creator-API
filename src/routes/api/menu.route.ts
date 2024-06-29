import express from "express";
import {
  getMenuItem,
  getMenuItems,
  deleteMenuItem,
  updatedMenuItem,
  createMenuItem,
  sortMenuItems,
} from "@controllers/menu_cotroller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const menuRoutes = express.Router();

menuRoutes.route("/").get(verifyAPIKey, getMenuItems).post(verifyJWT, createMenuItem);

menuRoutes.route("/sort").put(verifyJWT, sortMenuItems);

menuRoutes
  .route("/:id")
  .get(verifyAPIKey, getMenuItem)
  .put(verifyJWT, updatedMenuItem)
  .delete(verifyJWT, deleteMenuItem);

export default menuRoutes;
