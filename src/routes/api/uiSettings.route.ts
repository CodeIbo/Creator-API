import {
  getUISettingForPanel,
  getUISettings,
  getUISettingsForPanel,
  updateUISettings,
} from "@controllers/uiSettings_controller";
import verifyAPIKey from "@src/middleware/verifyAPIKey";
import verifyJWT from "@src/middleware/verifyJWT";
import express from "express";

const uiSettingsRoutes = express.Router();

uiSettingsRoutes.route("/").get(verifyAPIKey, getUISettings);

uiSettingsRoutes.route("/panel/").get(verifyAPIKey, getUISettingsForPanel);

uiSettingsRoutes.route("/panel/:id").get(verifyAPIKey, getUISettingForPanel).put(verifyJWT, updateUISettings);

export default uiSettingsRoutes;
