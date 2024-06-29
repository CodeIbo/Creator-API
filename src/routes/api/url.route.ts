import { endpointGetUrls } from "@controllers/url_controller";
import verifyAPIKey from "@middleware/verifyAPIKey";
import express from "express";

const urlRoutes = express.Router();

urlRoutes.route("/").get(verifyAPIKey, endpointGetUrls);

export default urlRoutes;
