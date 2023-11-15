import express from "express";
import {
  createBlogPosts,
  deleteBlogPost,
  getBlogPost,
  getBlogPosts,
  updateBlogPost,
} from "@controllers/blog_controller";
import verifyJWT from "@middleware/verifyJWT";

const blogRoutes = express.Router();

blogRoutes.route("/").get(getBlogPosts).post(verifyJWT, createBlogPosts);

blogRoutes.route("/:id").get(getBlogPost).put(verifyJWT, updateBlogPost).delete(verifyJWT, deleteBlogPost);

export default blogRoutes;
