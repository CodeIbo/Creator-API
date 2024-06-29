import { getSiteMapXML } from "@controllers/xml_controller";
import verifyAPIKey from "@src/middleware/verifyAPIKey";
import express from "express";

const xmlRoutes = express.Router();

xmlRoutes.route("/").get(verifyAPIKey, getSiteMapXML);

export default xmlRoutes;
