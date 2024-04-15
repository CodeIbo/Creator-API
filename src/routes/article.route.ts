import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticlesByKey,
  getArticle,
  updateArticle,
} from "@controllers/article_controller";
import verifyJWT from "@middleware/verifyJWT";

const articleRoute = express.Router();

articleRoute.route("/").get(getArticlesByKey).post(verifyJWT, createArticle);

articleRoute.route("/:id").get(getArticle).put(verifyJWT, updateArticle).delete(verifyJWT, deleteArticle);

export default articleRoute;
