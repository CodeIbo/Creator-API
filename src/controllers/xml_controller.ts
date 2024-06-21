import { type Response, type Request } from "express";
import xml from "xml";
import Urls from "@db/models/Urls.model";
import Articles from "@db/models/Articles.model";
import Podcasts from "@db/models/Podcasts.model";
import Episodes from "@db/models/Episodes.model";
import { mergeArraysWithUrls } from "@helpers/contentMerger.helper";
import Blogs from "@db/models/Blogs.model";
import ResponseController from "./response_controller";
import httpStatus from "@db/http_status";

export const getSiteMapXML = async (req: Request, res: Response) => {
  try {
    const pages = await Urls.findAll();
    const blogs = await Blogs.findAll();
    const podcasts = await Podcasts.findAll();
    const articles = await Articles.findAll();
    const episodes = await Episodes.findAll();
    const mergedBlogs = await mergeArraysWithUrls<Blogs>(blogs, "blog");
    const mergedPodcasts = await mergeArraysWithUrls<Podcasts>(podcasts, "podcast");

    const articleXML = mergedBlogs.flatMap((blog) => {
      const matchedArticle = articles.filter((article) => article.blog_key === blog.blog_key);
      return matchedArticle.map((article) => ({
        url: [
          { loc: `${process.env.FRONT_END_URL as string}/blog/${blog.url}/${article.url}` },
          { changefreq: "weekly" },
          { priority: "0.85" },
        ],
      }));
    });

    const episodeXML = mergedPodcasts.flatMap((podcast) => {
      const matchedEpisodes = episodes.filter((episode) => episode.podcast_key === podcast.podcast_key);
      return matchedEpisodes.map((matchedEpisode) => ({
        url: [
          { loc: `${process.env.FRONT_END_URL as string}/podcast/${podcast.url}/${matchedEpisode.url}` },
          { changefreq: "weekly" },
          { priority: "0.85" },
        ],
      }));
    });

    const pageXML = pages.map((page) => {
      switch (page.page_category) {
        case "blog":
          return {
            url: [
              { loc: `${process.env.FRONT_END_URL as string}/blog/${page.url}` },
              { changefreq: "weekly" },
              { priority: "1.0" },
            ],
          };

        case "podcast":
          return {
            url: [
              { loc: `${process.env.FRONT_END_URL as string}/podcast/${page.url}` },
              { changefreq: "weekly" },
              { priority: "1.0" },
            ],
          };

        default:
          return {
            url: [
              { loc: `${process.env.FRONT_END_URL as string}/${page.url}` },
              { changefreq: "weekly" },
              { priority: "1.0" },
            ],
          };
      }
    });

    const sitemapObj = [
      {
        _attr: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" },
      },
      ...pageXML,
      ...articleXML,
      ...episodeXML,
    ];
    return res.set("Content-Type", "text/xml").send(xml([{ urlset: sitemapObj }], { declaration: true }));
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Error`,
          err
        )
      );
  }
};
