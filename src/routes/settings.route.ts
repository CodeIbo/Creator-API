import express from "express";
import { updateSettings, getSettings, getSettingsById } from "@controllers/settings_controller";
import verifyJWT from "@middleware/verifyJWT";

const settingsRoutes = express.Router();

settingsRoutes.route("/").get(verifyJWT, getSettings);

settingsRoutes.route("/:id").get(getSettingsById).put(verifyJWT, updateSettings);

export default settingsRoutes;
