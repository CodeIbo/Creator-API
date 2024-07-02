import express from "express";

import { getSiteMapXML } from "@controllers/xml_controller";
import verifyAPIKey from "@middleware/verifyAPIKey";

const xmlRoutes = express.Router();

xmlRoutes.route("/").get(verifyAPIKey, getSiteMapXML);

export default xmlRoutes;
