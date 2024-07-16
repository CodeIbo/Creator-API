import express from "express";

import { createPodcast, deletePodcast, getPodcast, getPodcasts, updatePodcast } from "@controllers/podcast_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const podcastRoutes = express.Router();

podcastRoutes.route("/").get(verifyAPIKey, getPodcasts).post(verifyJWT, createPodcast);

podcastRoutes
  .route("/:id")
  .get(verifyAPIKey, getPodcast)
  .put(verifyJWT, updatePodcast)
  .delete(verifyJWT, deletePodcast);

export default podcastRoutes;
