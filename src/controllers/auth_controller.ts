import { isLoginUserObject } from "@guards/user_guard";
import { type Request, type Response } from "express";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import database from "@config/mysql.config";
import USER_QUERY from "@db/query/users_query";
import { type userObject } from "@models/user.model";
import { comparePassword } from "./password_controller";
import jwt from "jsonwebtoken";
import _ from "lodash";
import type JwtPayload from "@src/models/jwt.model";

const login = (req: Request, res: Response): void => {
  const userLog: Record<string, any> = {
    email: req.headers?.email,
    user_password: req.headers?.user_password,
  };

  if (!isLoginUserObject(userLog)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `Username and password are required.`
        )
      );
    return;
  }
  database.query(
    USER_QUERY.SELECT_USER("email"),
    [userLog.email],
    (_error, selectedUser: undefined | { "0": userObject }) => {
      if (selectedUser?.[0] === undefined) {
        res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Can't find user ${userLog.email}`
            )
          );
      } else {
        const userFromDB = selectedUser[0];
        comparePassword(userLog.user_password, userFromDB.user_password)
          .then((data) => {
            if (!_.isBoolean(data)) {
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
            if (!data) {
              res
                .status(httpStatus.UNAUTHORAIZED.code)
                .send(
                  new ResponseController(
                    httpStatus.UNAUTHORAIZED.code,
                    httpStatus.UNAUTHORAIZED.status,
                    "Wrong password"
                  )
                );
              return;
            }
            const accessToken = jwt.sign({ email: userFromDB.email }, process.env.ACCESS_TOKEN_SECRET as string, {
              expiresIn: "30s",
            });
            const refreshToken = jwt.sign({ email: userFromDB.email }, process.env.REFRESH_TOKEN_SECRET as string, {
              expiresIn: "1d",
            });
            database.query(
              USER_QUERY.UPDATE_USER({ refresh_token: refreshToken }),
              [refreshToken, userFromDB.id],
              (error, _results) => {
                if (error === null) {
                  res.cookie("jwt", refreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                  });
                  res.status(httpStatus.OK.code).send(
                    new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "New Token Received", {
                      email: userLog.email,
                      token: accessToken,
                    })
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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};

const refreshJWTToken = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res
      .status(httpStatus.UNAUTHORAIZED.code)
      .send(
        new ResponseController(httpStatus.UNAUTHORAIZED.code, httpStatus.UNAUTHORAIZED.status, "Missing auth cookies")
      );
    return;
  }
  const refreshToken: string = cookies.jwt;

  database.query(
    USER_QUERY.SELECT_USER("refresh_token"),
    [refreshToken],
    (error, selectedUser: undefined | { "0": userObject }) => {
      if (error ?? !selectedUser) {
        res
          .status(httpStatus.FORBIDDEN.code)
          .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Wrong cookies"));
      } else {
        const { email } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
        if (selectedUser["0"]?.email !== email) {
          res
            .status(httpStatus.FORBIDDEN.code)
            .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Forbidden"));
          return;
        }
        const accessToken = jwt.sign({ email: selectedUser["0"].email }, process.env.ACCESS_TOKEN_SECRET as string, {
          expiresIn: "30s",
        });
        res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "New Token Received", accessToken));
      }
    }
  );
};

export { login, refreshJWTToken };
