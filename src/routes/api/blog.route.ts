import express from "express";

import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from "@controllers/blog_controller";
import verifyJWT from "@middleware/verifyJWT";
import verifyAPIKey from "@middleware/verifyAPIKey";

const blogRoutes = express.Router();

blogRoutes.route("/").get(verifyAPIKey, getBlogs).post(verifyJWT, createBlog);

blogRoutes.route("/:id").get(verifyAPIKey, getBlog).put(verifyJWT, updateBlog).delete(verifyJWT, deleteBlog);

export default blogRoutes;
