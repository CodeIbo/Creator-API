import express from "express";
import { deleteImage, getImage, getImages, uploadImage } from "@controllers/image_controller";
import multerUpload from "@config/multer.config";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const imageRoutes = express.Router();

imageRoutes.route("/").get(verifyAPIKey, getImages).post(verifyJWT, multerUpload.single("file"), uploadImage);

imageRoutes.route("/:id").get(getImage).delete(verifyJWT, deleteImage);

export default imageRoutes;
