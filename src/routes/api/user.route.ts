import express from "express";

import { createUser, deleteUser, getUser, getUsers, updateUser } from "@controllers/user_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const userRoutes = express.Router();

userRoutes.route("/").get([verifyAPIKey, verifyJWT], getUsers).post(verifyJWT, createUser);

userRoutes
  .route("/:id")
  .get([verifyAPIKey, verifyJWT], getUser)
  .put(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);

export default userRoutes;
