import express from "express";
import verifyJWT from "@middleware/verifyJWT";
import {
  getListSocialMedia,
  getSocialMediaById,
  sortSocialMedia,
  updateSocialMedia,
} from "@controllers/socialMedia_controller";

const socialMediaRoutes = express.Router();

socialMediaRoutes.route("/").get(getListSocialMedia);

socialMediaRoutes.route("/sort").put(verifyJWT, sortSocialMedia);

socialMediaRoutes.route("/:id").get(getSocialMediaById).put(verifyJWT, updateSocialMedia);

export default socialMediaRoutes;
