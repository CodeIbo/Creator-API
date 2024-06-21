import { type Response, type Request } from "express";
import _ from "lodash";

import ResponseController from "./response_controller";
import { addNewUrl, deleteUrlObject, getUrlById, updateUrlObject } from "./url_controller";

import httpStatus from "@db/http_status";
import Blogs from "@db/models/Blogs.model";

import { keysFilter } from "@helpers/key.helper";
import { mergeArraysWithUrls, mergeObjectWithUrl } from "@helpers/contentMerger.helper";

import { isNewBlogObject, isUpdateBlogObject } from "@guards/blog_guard";

export const getBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blogs.findAll();
    const mergedBlogs = await mergeArraysWithUrls<Blogs>(blogs, "blog");

    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Blogs", mergedBlogs));
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          "Internal server error",
          err
        )
      );
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blogs.findOne({ where: { id: req.params.id } });
    if (!blog) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Blog not found"));
    }
    const mergedBlog = await mergeObjectWithUrl<Blogs>(blog, req.params.id);
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Blog received", mergedBlog));
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
  }
};

export const createBlog = (req: Request, res: Response): void => {
  const newBlog = req.body;
  if (!isNewBlogObject(newBlog)) {
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
    addNewUrl(newBlog)
      .then((data) => {
        if (data.status && data.data) {
          Blogs.create({ id: data.data.id, blog_title: newBlog.blog_title, blog_key: newBlog.blog_key })
            .then((page) => {
              return res
                .status(httpStatus.OK.code)
                .send(
                  new ResponseController(
                    httpStatus.OK.code,
                    httpStatus.OK.status,
                    `New Item added`,
                    _.defaults(page.get({ plain: true }), data.data.get({ plain: true }))
                  )
                );
            })
            .catch((err) => {
              return res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
            });
        } else {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).send(
            new ResponseController(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              "Failed adding URL",
              {
                status: data.status,
                err: data.err,
              }
            )
          );
        }
      })
      .catch((_err) => {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, _err));
      });
  }
};

export const updateBlog = (req: Request, res: Response) => {
  const updateBlogObj = req.body;
  if (!isUpdateBlogObject(updateBlogObj)) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  } else {
    const blogKeys = keysFilter(Blogs, ["id", "created_at"], false);
    const filteredObject = _.pickBy(updateBlogObj, (v: any, k: string) => {
      return blogKeys.includes(k);
    });
    updateUrlObject(updateBlogObj, req.params.id)
      .then(async (data) => {
        if (data?.status && data.data) {
          if (Object.keys(filteredObject).length > 0) {
            await Blogs.update(filteredObject, { where: { id: req.params.id } }).catch((_err) => {
              return res
                .status(httpStatus.NOT_FOUND.code)
                .send(
                  new ResponseController(
                    httpStatus.NOT_FOUND.code,
                    httpStatus.NOT_FOUND.status,
                    `Blog by id ${req.params.id} was not found`,
                    _err
                  )
                );
            });
          }
          const updatedUrl = await getUrlById(req.params.id);
          const updatedBlog = await Blogs.findOne({ where: { id: req.params.id } });
          if (updatedUrl.data && updatedUrl.status && updatedBlog) {
            return res
              .status(httpStatus.OK.code)
              .send(
                new ResponseController(
                  httpStatus.OK.code,
                  httpStatus.OK.status,
                  `Blog Updated`,
                  _.defaults(updatedBlog.get(), updatedUrl.data.get())
                )
              );
          }
        } else {
          return res
            .status(httpStatus.OK.code)
            .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Blog update fail`, data));
        }
      })
      .catch((_err) => {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Blog by id ${req.params.id} was not found`,
              _err
            )
          );
      });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const result = await deleteUrlObject(req.params.id);
  if (result.status) {
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Blog deleted"));
  } else {
    return res
      .status(httpStatus.NOT_FOUND.code)
      .send(
        new ResponseController(
          httpStatus.NOT_FOUND.code,
          httpStatus.NOT_FOUND.status,
          `Blog by id ${req.params.id} was not found`
        )
      );
  }
};
