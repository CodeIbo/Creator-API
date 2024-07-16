import express from "express";

import articleRoute from "./article.route";
import authRoutes from "./auth.route";
import blogRoutes from "./blog.route";
import episodeRoutes from "./episode.route";
import imageRoutes from "./image.route";
import menuRoutes from "./menu.route";
import pageRoutes from "./page.route";
import podcastRoutes from "./podcast.route";
import settingsRoutes from "./settings.route";
import socialMediaRoutes from "./socialMedia.route";
import urlRoutes from "./url.route";
import userRoutes from "./user.route";
import xmlRoutes from "./xml.route";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);

apiRoutes.use("/users", userRoutes);

apiRoutes.use("/pages", pageRoutes);

apiRoutes.use("/blog", blogRoutes);

apiRoutes.use("/article", articleRoute);

apiRoutes.use("/podcast", podcastRoutes);

apiRoutes.use("/episode", episodeRoutes);

apiRoutes.use("/image", imageRoutes);

apiRoutes.use("/menu", menuRoutes);

apiRoutes.use("/url", urlRoutes);

apiRoutes.use("/social-media", socialMediaRoutes);

apiRoutes.use("/settings", settingsRoutes);

apiRoutes.use("/sitemap.xml", xmlRoutes);

export default apiRoutes;
