import express from "express";
import verifyJWT from "@middleware/verifyJWT";
import {
  createEpisode,
  deleteEpisode,
  getEpisode,
  getEpisodesByKey,
  updateEpisode,
} from "@controllers/episode_controller";

const episodeRoutes = express.Router();

episodeRoutes.route("/").get(getEpisodesByKey).post(verifyJWT, createEpisode);

episodeRoutes.route("/:id").get(getEpisode).put(verifyJWT, updateEpisode).delete(verifyJWT, deleteEpisode);

export default episodeRoutes;
