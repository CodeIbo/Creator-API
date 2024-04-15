import express from "express";
import { createPodcast, deletePodcast, getPodcast, getPodcasts, updatePodcast } from "@controllers/podcast_controller";
import verifyJWT from "@middleware/verifyJWT";

const podcastRoutes = express.Router();

podcastRoutes.route("/").get(getPodcasts).post(verifyJWT, createPodcast);

podcastRoutes.route("/:id").get(getPodcast).put(verifyJWT, updatePodcast).delete(verifyJWT, deletePodcast);

export default podcastRoutes;
