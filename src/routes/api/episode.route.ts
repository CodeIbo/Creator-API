import express from "express";

import verifyJWT from "@middleware/verifyJWT";
import {
  createEpisode,
  deleteEpisode,
  getEpisode,
  getEpisodesByKey,
  updateEpisode,
} from "@controllers/episode_controller";
import verifyAPIKey from "@middleware/verifyAPIKey";

const episodeRoutes = express.Router();

episodeRoutes.route("/").get(verifyAPIKey, getEpisodesByKey).post(verifyJWT, createEpisode);

episodeRoutes
  .route("/:id")
  .get(verifyAPIKey, getEpisode)
  .put(verifyJWT, updateEpisode)
  .delete(verifyJWT, deleteEpisode);

export default episodeRoutes;
