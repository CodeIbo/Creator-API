import database from "@config/mysql.config";
import BLOG_QUERY from "@db/query/blog_query";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import { isNewBlogObject, isUpdateBlogObject } from "@guards/blog_guard";

export const getBlogPosts = (_req: Request, res: Response): void => {
  database.query(BLOG_QUERY.SELECT_BLOG_POSTS, (_error, results) => {
    if (results === undefined) {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "No Blog Posts found"));
    } else {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Blog Posts retrieved", results));
    }
  });
};

export const getBlogPost = (req: Request, res: Response): void => {
  database.query(BLOG_QUERY.SELECT_BLOG_POST, [req.params.id], (_error, results) => {
    if (results[0] === undefined) {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Blog Post by id ${req.params.id} was not found`
          )
        );
    } else {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Blog Post retreived`, results[0]));
    }
  });
};

export const createBlogPosts = (req: Request, res: Response): void => {
  const blogPost = req.body;
  if (!isNewBlogObject(blogPost)) {
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
    database.query(
      BLOG_QUERY.CREATE_BLOG_POST,
      [
        blogPost.post_name,
        blogPost.post_content,
        blogPost.meta_data_title,
        blogPost.meta_data_description,
        blogPost.post_url,
        blogPost.post_author,
        JSON.stringify(blogPost.post_tags),
        blogPost.publication_date,
      ],
      (error, result) => {
        if (result === undefined) {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .send(
              new ResponseController(
                httpStatus.INTERNAL_SERVER_ERROR.code,
                httpStatus.INTERNAL_SERVER_ERROR.status,
                `Error occurred`,
                error
              )
            );
        } else {
          res.status(httpStatus.CREATED.code).send(
            new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, `Blog Post created`, {
              blogPost,
            })
          );
        }
      }
    );
  }
};

export const updateBlogPost = (req: Request, res: Response) => {
  const updateBlogPostObj = req.body;
  if (!isUpdateBlogObject(updateBlogPostObj)) {
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
    database.query(BLOG_QUERY.SELECT_BLOG_POST, [req.params.id], (_error, results) => {
      if (results === undefined) {
        res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Blog Post by id ${req.params.id} was not found`
            )
          );
      } else {
        database.query(
          BLOG_QUERY.UPDATE_BLOG_POST(updateBlogPostObj),
          [...Object.values(updateBlogPostObj), req.params.id],
          (error, _results) => {
            if (error === null) {
              res.status(httpStatus.OK.code).send(
                new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Blog Post updated", {
                  id: req.params.id,
                  ...req.body,
                })
              );
            } else {
              console.log(error);
              res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                  new ResponseController(
                    httpStatus.INTERNAL_SERVER_ERROR.code,
                    httpStatus.INTERNAL_SERVER_ERROR.status,
                    "Error occured"
                  )
                );
            }
          }
        );
      }
    });
  }
};

export const deleteBlogPost = (req: Request, res: Response) => {
  database.query(BLOG_QUERY.DELETE_BLOG_POST, [req.params.id], (_error, results) => {
    if (results.affectedRows > 0) {
      res.status(httpStatus.OK.code).send(new ResponseController(httpStatus.OK.code, "Blog Post deleted", results[0]));
    } else {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Blog Post by id ${req.params.id} was not found`
          )
        );
    }
  });
};
