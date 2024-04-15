import express from "express";
import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from "@controllers/blog_controller";
import verifyJWT from "@middleware/verifyJWT";

const blogRoutes = express.Router();

blogRoutes.route("/").get(getBlogs).post(verifyJWT, createBlog);

blogRoutes.route("/:id").get(getBlog).put(verifyJWT, updateBlog).delete(verifyJWT, deleteBlog);

export default blogRoutes;
