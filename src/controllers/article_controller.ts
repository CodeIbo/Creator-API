import httpStatus from "@db/http_status";
import Articles from "@db/models/Articles.model";
import { isNewArticleObject, isUpdateArticleObject } from "@src/guards/article_guard";
import _ from "lodash";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";

export const getArticlesByKey = async (req: Request, res: Response) => {
  const blogKey = req.query.blog_key;
  if (_.isString(blogKey)) {
    await Articles.findAll({
      where: {
        blog_key: blogKey,
      },
    })
      .then((data) => {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Founded Articles", data));
      })
      .catch((err) => {
        return res
          .status(httpStatus.BAD_REQUEST.code)
          .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Error", err));
      });
  } else {
    return res
      .status(httpStatus.BAD_REQUEST.code)
      .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Error Query Params"));
  }
};

export const getArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  await Articles.findOne({
    where: {
      id,
    },
  })
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Article", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Article not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const createArticle = (req: Request, res: Response) => {
  const newArticle = req.body;

  if (!isNewArticleObject(newArticle)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  } else {
    Articles.create(newArticle)
      .then((article) => {
        return res
          .status(httpStatus.OK.code)
          .send(
            new ResponseController(
              httpStatus.OK.code,
              httpStatus.OK.status,
              `New Article added`,
              _.defaults(article.get())
            )
          );
      })
      .catch((err) => {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
      });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  const updateArticleObject = req.body;
  const id = req.params.id;

  if (!isUpdateArticleObject(updateArticleObject)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  } else {
    await Articles.update(updateArticleObject, { where: { id } }).catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });

    const updatedArticle = await Articles.findOne({ where: { id } });
    if (updatedArticle) {
      return res
        .status(httpStatus.OK.code)
        .send(
          new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Article Updated`, updatedArticle.get())
        );
    } else {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Article update fail`));
    }
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const affectedRows = await Articles.destroy({ where: { id: req.params.id } })
    .then((affRows) => affRows)
    .catch((_err) => _err);

  return typeof affectedRows === "number" && affectedRows > 0
    ? res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Article deleted`))
    : res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Failed article delete`));
};
