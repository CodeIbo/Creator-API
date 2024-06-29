import express from "express";
import { login, refreshJWTToken, logout } from "@controllers/auth_controller";
import verifyJWT from "@middleware/verifyJWT";

const authRoutes = express.Router();

authRoutes.route("/login").post(login);
authRoutes.route("/refresh").get(refreshJWTToken);
authRoutes.route("/logout").post(verifyJWT, logout);

export default authRoutes;
