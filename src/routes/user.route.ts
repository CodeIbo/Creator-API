import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "@controllers/user_controller";
import verifyJWT from "@middleware/verifyJWT";

const userRoutes = express.Router();

userRoutes.route("/").get(verifyJWT, getUsers).post(verifyJWT, createUser);

userRoutes.route("/:id").get(verifyJWT, getUser).put(verifyJWT, updateUser).delete(verifyJWT, deleteUser);

export default userRoutes;
