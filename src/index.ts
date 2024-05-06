import cors from "cors";
import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import "@config/mysql.config";
import userRoutes from "@routes/user.route";
import pageRoutes from "@routes/page.route";
import authRoutes from "@routes/auth.route";
import blogRoutes from "@routes/blog.route";
import articleRoute from "@routes/article.route";
import podcastRoutes from "@routes/podcast.route";
import episodeRoutes from "@routes/episode.route";
import imageRoutes from "@routes/image.route";
import menuRoutes from "@routes/menu.route";
import urlRoutes from "@routes/url.route";

const accessURLS = [process.env.PANEL_URL, process.env.FRONT_END_URL].filter(Boolean) as string[] | [];

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: accessURLS }));
app.use(express.json());
app.use(cookieparser());

app.get("/", (req, res) => {
  res.send("Server Work");
});

app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/pages", pageRoutes);

app.use("/blog", blogRoutes);

app.use("/article", articleRoute);

app.use("/podcast", podcastRoutes);

app.use("/episode", episodeRoutes);

app.use("/image", imageRoutes);

app.use("/menu", menuRoutes);

app.use("/url", urlRoutes);

app.listen(Number(process.env.SERVER_PORT) ?? 6666, () => {
  console.log(`App start at port ${process.env.SERVER_PORT ?? "6666"}`);
});

export default app;
