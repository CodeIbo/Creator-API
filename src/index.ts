import cors from "cors";
import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import "@config/mysql.config";
import apiRoutes from "@routes/api/index.route";
import apiLimiter from "@config/rate-limit.config";

const accessURLS = [process.env.PANEL_URL, process.env.FRONT_END_URL].filter(Boolean) as string[] | [];

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: accessURLS }));
app.use(express.json());
app.use(cookieparser());

if (process.env.NODE_ENV === "production") {
  app.use(apiLimiter);
}

app.get("/", (req, res) => {
  res.send("Server Work");
});

app.use("/api", apiRoutes);

app.listen(Number(process.env.SERVER_PORT) ?? 6666, () => {
  console.log(`App start at port ${process.env.SERVER_PORT ?? "6666"}`);
});

export default app;
