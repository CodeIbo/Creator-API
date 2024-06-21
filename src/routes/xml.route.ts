import { getSiteMapXML } from "@controllers/xml_controller";
import express from "express";

const xmlRoutes = express.Router();

xmlRoutes.route("/").get(getSiteMapXML);

export default xmlRoutes;
