import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import { isNewPageObject, isUpdatePageObject } from "@guards/page_guard";
import Pages from "@db/models/Pages.model";
import { addNewUrl, deleteUrlObject, getUrlById, getUrlsByCategory, updateUrlObject } from "./url_controller";
import _ from "lodash";

export const getPages = (_req: Request, res: Response): void => {
  getUrlsByCategory("page")
    .then((data) => {
      if (data.status) {
        Pages.findAll()
          .then((pages) => {
            const updatedPages = pages.map((page) => {
              const urlList = data.data.filter((url) => {
                return url.id === page.id;
              });
              let updatedPage = page.get();

              urlList.forEach((urlObj) => {
                updatedPage = _.defaults(updatedPage, urlObj.get());
              });
              return updatedPage;
            });
            return res
              .status(httpStatus.OK.code)
              .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found pages", updatedPages));
          })
          .catch((err) => {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
          });
      } else {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(new ResponseController(httpStatus.NOT_FOUND.code, httpStatus.NOT_FOUND.status, `Wrong page category`));
      }
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(httpStatus.INTERNAL_SERVER_ERROR.code, httpStatus.INTERNAL_SERVER_ERROR.status, err)
        );
    });
};

export const getPage = (req: Request, res: Response): void => {
  getUrlById(req.params.id)
    .then((data) => {
      if (data.status) {
        Pages.findOne({ where: { id: req.params.id } })
          .then((page) => {
            if (page !== null && data.data) {
              return res
                .status(httpStatus.OK.code)
                .send(
                  new ResponseController(
                    httpStatus.OK.code,
                    httpStatus.OK.status,
                    "Page received",
                    _.defaults(page.get({ plain: true }), data.data.get({ plain: true }))
                  )
                );
            }
          })
          .catch((err) => {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  "Error",
                  err
                )
              );
          });
      }
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
    });
};

export const createPage = (req: Request, res: Response): void => {
  const newPage = req.body;
  if (!isNewPageObject(newPage)) {
    res
      .status(httpStatus.BAD_REQUEST.code)
      .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, `No valid data`));
  } else {
    addNewUrl(newPage)
      .then((data) => {
        if (data.status && !!data.data) {
          Pages.create({ id: data.data.id, page_content: newPage.page_content, page_type: data.data.page_category })
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
          return res.status(httpStatus.BAD_REQUEST.code).send(
            new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Failed adding URL", {
              status: data.status,
              err: data.err,
            })
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

export const updatePage = async (req: Request, res: Response) => {
  const updatePageObj = req.body;
  if (!isUpdatePageObject(updatePageObj)) {
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
    if (updatePageObj.page_content) {
      await Pages.update({ page_content: updatePageObj.page_content }, { where: { id: req.params.id } }).catch(
        (_err) => {
          return res
            .status(httpStatus.NOT_FOUND.code)
            .send(
              new ResponseController(
                httpStatus.NOT_FOUND.code,
                httpStatus.NOT_FOUND.status,
                `Page by id ${req.params.id} was not found`,
                _err
              )
            );
        }
      );
    }

    updateUrlObject(updatePageObj, req.params.id)
      .then(async (data) => {
        const updatedUrl = await getUrlById(req.params.id);
        const updatedPage = await Pages.findOne({ where: { id: req.params.id } });
        if (updatedUrl.data && updatedPage && data?.status) {
          return res
            .status(httpStatus.OK.code)
            .send(
              new ResponseController(
                httpStatus.OK.code,
                httpStatus.OK.status,
                `Page Updated`,
                _.defaults(updatedPage.get(), updatedUrl.data.get())
              )
            );
        } else {
          return res
            .status(httpStatus.OK.code)
            .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Page update fail`, data));
        }
      })
      .catch((_err) => {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Page by id ${req.params.id} was not found`,
              _err
            )
          );
      });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  const result = await deleteUrlObject(req.params.id);
  if (result.status) {
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Page deleted"));
  } else {
    return res
      .status(httpStatus.NOT_FOUND.code)
      .send(
        new ResponseController(
          httpStatus.NOT_FOUND.code,
          httpStatus.NOT_FOUND.status,
          `Page by id ${req.params.id} was not found`
        )
      );
  }
};
