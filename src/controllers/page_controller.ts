import database from "@config/mysql.config";
import PAGES_QUERY from "@db/query/pages_query";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import { isNewPageObject, isUpdatePageObject } from "@guards/page_guard";

export const getPages = (_req: Request, res: Response): void => {
  database.query(PAGES_QUERY.SELECT_PAGES, (_error, results) => {
    if (results === undefined) {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "No pages found"));
    } else {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Pages retrieved", results));
    }
  });
};

export const getPage = (req: Request, res: Response): void => {
  database.query(PAGES_QUERY.SELECT_PAGE, [req.params.id], (_error, results) => {
    if (results[0] === undefined) {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Page by id ${req.params.id} was not found`
          )
        );
    } else {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Page retreived`, results[0]));
    }
  });
};

export const createPage = (req: Request, res: Response): void => {
  const newPage = req.body;
  if (!isNewPageObject(newPage)) {
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
      PAGES_QUERY.CREATE_PAGE,
      [
        newPage.page_name,
        newPage.page_content,
        newPage.meta_data_title,
        newPage.meta_data_description,
        newPage.page_url,
      ],
      (_error, result) => {
        if (result === undefined) {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .send(
              new ResponseController(
                httpStatus.INTERNAL_SERVER_ERROR.code,
                httpStatus.INTERNAL_SERVER_ERROR.status,
                `Error occurred`
              )
            );
        } else {
          res
            .status(httpStatus.CREATED.code)
            .send(
              new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, `Page created`, { newPage })
            );
        }
      }
    );
  }
};

export const updatePage = (req: Request, res: Response) => {
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
    database.query(PAGES_QUERY.SELECT_PAGE, [req.params.id], (_error, results) => {
      if (results === undefined) {
        res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Page by id ${req.params.id} was not found`
            )
          );
      } else {
        database.query(
          PAGES_QUERY.UPDATE_PAGE(updatePageObj),
          [...Object.values(updatePageObj), req.params.id],
          (error, _results) => {
            if (error === null) {
              res.status(httpStatus.OK.code).send(
                new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Page updated", {
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

export const deletePage = (req: Request, res: Response) => {
  database.query(PAGES_QUERY.DELETE_PAGE, [req.params.id], (_error, results) => {
    if (results.affectedRows > 0) {
      res.status(httpStatus.OK.code).send(new ResponseController(httpStatus.OK.code, "Page deleted", results[0]));
    } else {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Page by id ${req.params.id} was not found`
          )
        );
    }
  });
};
