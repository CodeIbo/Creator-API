import express from "express";

import { endpointGetUrls } from "@controllers/url_controller";
import verifyAPIKey from "@middleware/verifyAPIKey";

const urlRoutes = express.Router();

urlRoutes.route("/").get(verifyAPIKey, endpointGetUrls);

export default urlRoutes;
