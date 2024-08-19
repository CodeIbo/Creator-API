import express from "express";

import { getSiteMapXML } from "@controllers/xml_controller";

const xmlRoutes = express.Router();

xmlRoutes.route("/").get(getSiteMapXML);

export default xmlRoutes;
