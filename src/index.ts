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

dotenv.config();
const app = express();
app.use(cors({ credentials: true }));
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

app.listen(Number(process.env.SERVER_PORT) ?? 6666, () => {
  console.log(`Aplikacja wystartowała na porcie ${process.env.SERVER_PORT ?? "6666"}`);
});
