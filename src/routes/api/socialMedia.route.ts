import express from "express";

import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";
import {
  getListSocialMedia,
  getSocialMediaById,
  sortSocialMedia,
  updateSocialMedia,
} from "@controllers/socialMedia_controller";

const socialMediaRoutes = express.Router();

socialMediaRoutes.route("/").get(verifyAPIKey, getListSocialMedia);

socialMediaRoutes.route("/sort").put(verifyJWT, sortSocialMedia);

socialMediaRoutes.route("/:id").get(verifyAPIKey, getSocialMediaById).put(verifyJWT, updateSocialMedia);

export default socialMediaRoutes;
