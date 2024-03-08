import { isLoginUserObject } from "@guards/user_guard";
import { type Request, type Response } from "express";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { comparePassword } from "./password_controller";
import jwt from "jsonwebtoken";
import _ from "lodash";
import type JwtPayload from "@src/models/jwt.model";
import Users from "@db/models/Users.model";

const login = async (req: Request, res: Response) => {
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
  Users.findOne({
    where: {
      email: userLog.email,
    },
  })
    .then(async (user) => {
      if (user === null) {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Can't find user ${userLog.email}`
            )
          );
      }
      comparePassword(userLog.user_password, user.user_password)
        .then(async (data) => {
          if (!_.isBoolean(data)) {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  `Password Error`,
                  data
                )
              );
          }
          if (!data) {
            return res
              .status(httpStatus.UNAUTHORAIZED.code)
              .send(
                new ResponseController(httpStatus.UNAUTHORAIZED.code, httpStatus.UNAUTHORAIZED.status, "Wrong password")
              );
          }
          const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: "5m",
          });
          const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET as string, {
            expiresIn: "1d",
          });
          user.refresh_token = refreshToken;
          await user.save();
          const responseCookie = res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          const responseAccessToken = res.status(httpStatus.OK.code).send(
            new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "New Token Received", {
              email: userLog.email,
              token: accessToken,
            })
          );
          return responseCookie && responseAccessToken;
        })
        .catch((data) => {
          console.log(data);
        });
    })
    .catch((data) => {
      console.log(data);
    });
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

  Users.findOne({
    where: {
      refresh_token: cookies.jwt,
    },
  })
    .then((selectedUser) => {
      if (selectedUser === null) {
        res
          .status(httpStatus.FORBIDDEN.code)
          .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Wrong cookies"));
      } else {
        const { email } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
        if (selectedUser.email !== email) {
          return res
            .status(httpStatus.FORBIDDEN.code)
            .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Forbidden"));
        }
        const accessToken = jwt.sign({ email: selectedUser.email }, process.env.ACCESS_TOKEN_SECRET as string, {
          expiresIn: "30s",
        });
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "New Token Received", accessToken));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export { login, refreshJWTToken };
