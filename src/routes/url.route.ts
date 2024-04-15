import { endpointGetUrls } from "@controllers/url_controller";
import express from "express";

const urlRoutes = express.Router();

urlRoutes.route("/").get(endpointGetUrls);

export default urlRoutes;
