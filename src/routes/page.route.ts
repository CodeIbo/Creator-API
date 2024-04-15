import express from "express";
import { createPage, deletePage, getPage, getPages, updatePage } from "@controllers/page_controller";
import verifyJWT from "@middleware/verifyJWT";

const pageRoutes = express.Router();

pageRoutes.route("/").get(getPages).post(verifyJWT, createPage);

pageRoutes.route("/:id").get(getPage).put(verifyJWT, updatePage).delete(verifyJWT, deletePage);

export default pageRoutes;
