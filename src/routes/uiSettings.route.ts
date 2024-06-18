import {
  getUISettingForPanel,
  getUISettings,
  getUISettingsForPanel,
  updateUISettings,
} from "@controllers/uiSettings_controller";
import verifyJWT from "@src/middleware/verifyJWT";
import express from "express";

const uiSettingsRoutes = express.Router();

uiSettingsRoutes.route("/").get(getUISettings);

uiSettingsRoutes.route("/panel/").get(getUISettingsForPanel);

uiSettingsRoutes.route("/panel/:id").get(getUISettingForPanel).put(verifyJWT, updateUISettings);

export default uiSettingsRoutes;
