import express from "express";

import {
  createArticle,
  deleteArticle,
  getArticlesByKey,
  getArticle,
  updateArticle,
  getArticleByQuery,
} from "@controllers/article_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const articleRoute = express.Router();

articleRoute.route("/").get(verifyAPIKey, getArticlesByKey).post(verifyJWT, createArticle);

articleRoute.route("/key").get(verifyAPIKey, getArticleByQuery);

articleRoute.route("/:id").get(verifyAPIKey, getArticle).put(verifyJWT, updateArticle).delete(verifyJWT, deleteArticle);

export default articleRoute;
