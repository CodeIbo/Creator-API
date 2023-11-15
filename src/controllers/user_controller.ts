import { type Response, type Request } from "express";
import _ from "lodash";
import database from "@config/mysql.config";
import USER_QUERY from "@db/query/users_query";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { isNewUserObject, isUpdateUserObject } from "@guards/user_guard";
import { encryptPassword } from "./password_controller";
import { type userObject } from "@models/user.model";

export const getUsers = (_req: Request, res: Response): void => {
  database.query(USER_QUERY.SELECT_USERS, (_error, results) => {
    if (results === undefined) {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "No users found"));
    } else {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Users retrieved", results));
    }
  });
};

export const getUser = (req: Request, res: Response): void => {
  database.query(
    USER_QUERY.SELECT_USER("id"),
    [req.params.id],
    (_error, selectedUser: undefined | { "0": userObject }) => {
      if (selectedUser?.[0] === undefined) {
        res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `User by id ${req.params.id} was not found`
            )
          );
      } else {
        res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `User retreived`, selectedUser[0]));
      }
    }
  );
};

export const createUser = (req: Request, res: Response): void => {
  const newUser: Record<string, any> = req.body;
  if (!isNewUserObject(newUser)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No vaild data`
        )
      );
    return;
  }
  const userCopy = _.clone(newUser);
  const hashedPswd = encryptPassword(userCopy.user_password);
  hashedPswd
    .then((data) => {
      if (!_.isString(data)) {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(
            new ResponseController(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              `Error occurred`
            )
          );
        return;
      }
      userCopy.user_password = data;

      database.query(
        USER_QUERY.CREATE_USER,
        [userCopy.nick_name, userCopy.email, userCopy.user_password, userCopy.access_lvl],
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
                new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, `User created`, { newUser })
              );
          }
        }
      );
    })
    .catch((_err: Error) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(
            httpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus.INTERNAL_SERVER_ERROR.status,
            `Error occurred`
          )
        );
    });
};

export const updateUser = (req: Request, res: Response) => {
  const updateUserObject = req.body;
  const copyupdateUserObject = _.clone(updateUserObject);
  if (!isUpdateUserObject(copyupdateUserObject)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No vaild data`
        )
      );
    return;
  }
  database.query(
    USER_QUERY.SELECT_USER("id"),
    [req.params.id],
    (_error, selectedUser: undefined | { "0": userObject }) => {
      if (selectedUser?.[0] === undefined) {
        res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `User by id ${req.params.id} was not found`
            )
          );
      } else {
        if (copyupdateUserObject?.user_password === undefined) {
          database.query(
            USER_QUERY.UPDATE_USER(copyupdateUserObject),
            [...Object.values(copyupdateUserObject), req.params.id],
            (error, _results) => {
              if (error === null) {
                res
                  .status(httpStatus.OK.code)
                  .send(
                    new ResponseController(
                      httpStatus.OK.code,
                      httpStatus.OK.status,
                      "User updated",
                      _.defaults(copyupdateUserObject, selectedUser[0])
                    )
                  );
              } else {
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
        } else {
          const hashedPswd = encryptPassword(copyupdateUserObject.user_password);
          hashedPswd
            .then((data) => {
              if (!_.isString(data)) {
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
                copyupdateUserObject.user_password = data;
                database.query(
                  USER_QUERY.UPDATE_USER(copyupdateUserObject),
                  [...Object.values(copyupdateUserObject), req.params.id],
                  (error) => {
                    if (error === null) {
                      res
                        .status(httpStatus.OK.code)
                        .send(
                          new ResponseController(
                            httpStatus.OK.code,
                            httpStatus.OK.status,
                            "User updated",
                            _.defaults(copyupdateUserObject, selectedUser[0])
                          )
                        );
                    } else {
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
            })
            .catch((_err) => {
              res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                  new ResponseController(
                    httpStatus.INTERNAL_SERVER_ERROR.code,
                    httpStatus.INTERNAL_SERVER_ERROR.status,
                    "Error occured"
                  )
                );
            });
        }
      }
    }
  );
};

export const deleteUser = (req: Request, res: Response) => {
  database.query(USER_QUERY.DELETE_USER, [req.params.id], (_error, results) => {
    if (results.affectedRows > 0) {
      res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "User deleted"));
    } else {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `User by id ${req.params.id} was not found`
          )
        );
    }
  });
};
