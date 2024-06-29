import express from "express";
import { createPage, deletePage, getPage, getPages, updatePage } from "@controllers/page_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const pageRoutes = express.Router();

pageRoutes.route("/").get(verifyAPIKey, getPages).post(verifyJWT, createPage);

pageRoutes.route("/:id").get(verifyAPIKey, getPage).put(verifyJWT, updatePage).delete(verifyJWT, deletePage);

export default pageRoutes;
