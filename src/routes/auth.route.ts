import express from "express";
import { login, refreshJWTToken } from "@controllers/auth_controller";

const authRoutes = express.Router();

authRoutes.route("/login").post(login);
authRoutes.route("/refresh").get(refreshJWTToken);

export default authRoutes;
