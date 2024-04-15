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

const menuRoutes = express.Router();

menuRoutes.route("/").get(getMenuItems).post(verifyJWT, createMenuItem);

menuRoutes.route("/sort").put(verifyJWT, sortMenuItems);

menuRoutes.route("/:id").get(getMenuItem).put(verifyJWT, updatedMenuItem).delete(verifyJWT, deleteMenuItem);

export default menuRoutes;
