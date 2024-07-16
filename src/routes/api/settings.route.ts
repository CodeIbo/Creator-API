import express from "express";

import uiSettingsRoutes from "./uiSettings.route";
import { updateSettings, getSettings, getSettingsById, getDefaultSetting } from "@controllers/settings_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const settingsRoutes = express.Router();

settingsRoutes.route("/").get([verifyJWT, verifyAPIKey], getSettings);
settingsRoutes.route("/default").get(verifyAPIKey, getDefaultSetting);

settingsRoutes.use("/ui", uiSettingsRoutes);

settingsRoutes.route("/:id").get(verifyAPIKey, getSettingsById).put(verifyJWT, updateSettings);

export default settingsRoutes;
