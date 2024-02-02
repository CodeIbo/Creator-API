import { type Response, type Request } from "express";
import _ from "lodash";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { isNewUserObject, isUpdateUserObject } from "@guards/user_guard";
import { encryptPassword } from "./password_controller";
import Users from "@db/models/Users.model";
import { type userUpdateAttributes } from "@db/models/Users.model";

export const getUsers = async (_req: Request, res: Response) => {
  await Users.findAll()
    .then((users) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Users retrieved", users));
    })
    .catch((_error: any) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Cannot find Users"));
    });
};

export const getUser = async (req: Request, res: Response) => {
  await Users.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((selectedUser) => {
      if (selectedUser === null) {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `User by id ${req.params.id} was not found`
            )
          );
      } else {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `User retreived`, selectedUser));
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const createUser = (req: Request, res: Response) => {
  const newUser: Record<string, any> = req.body;
  if (!isNewUserObject(newUser)) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No vaild data`
        )
      );
  }
  const hashedPswd = encryptPassword(newUser.user_password);
  hashedPswd
    .then(async (data) => {
      if (!_.isString(data)) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(
            new ResponseController(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              `Error occurred`
            )
          );
      } else {
        newUser.user_password = data;
        await Users.create(newUser).then((createdUser) => {
          return res.status(httpStatus.CREATED.code).send(
            new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, `User created`, {
              createdUser,
            })
          );
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export const updateUser = (req: Request, res: Response) => {
  const updateUserObject = req.body;
  if (!isUpdateUserObject(updateUserObject)) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No vaild data`
        )
      );
  } else {
    const userResponder = (userObject: Partial<userUpdateAttributes>) => {
      Users.update(userObject, { where: { id: req.params.id } })
        .then(async (updatedRows) => {
          if (updatedRows[0] > 0) {
            Users.findOne({ where: { id: req.params.id } })
              .then((selectedUser) => {
                return res
                  .status(httpStatus.OK.code)
                  .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "User updated", selectedUser));
              })
              .catch((err) => {
                res
                  .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                  .send(
                    new ResponseController(
                      httpStatus.INTERNAL_SERVER_ERROR.code,
                      httpStatus.INTERNAL_SERVER_ERROR.status,
                      "Error occured",
                      err
                    )
                  );
              });
          } else {
            return res
              .status(httpStatus.NOT_FOUND.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  "No changes in user account / no valid user"
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
                "User cannot be updated",
                err
              )
            );
        });
    };
    if (updateUserObject?.user_password) {
      const hashedPswd = encryptPassword(updateUserObject.user_password);
      hashedPswd
        .then((data) => {
          if (!_.isString(data)) {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  "Error occured",
                  data
                )
              );
          } else {
            updateUserObject.user_password = data;
            userResponder(updateUserObject);
          }
        })
        .catch((err) => {
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .send(
              new ResponseController(
                httpStatus.INTERNAL_SERVER_ERROR.code,
                httpStatus.INTERNAL_SERVER_ERROR.status,
                "Error occured",
                err
              )
            );
        });
    } else {
      userResponder(updateUserObject);
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  await Users.destroy({
    where: {
      id: req.params.id,
    },
  }).then((data) => {
    if (data > 0) {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "User deleted"));
    } else {
      return res
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
