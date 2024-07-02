import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import _ from "lodash";

import ResponseController from "./response_controller";
import { comparePassword } from "./password_controller";
import { isLoginUserObject } from "@guards/user_guard";
import httpStatus from "@db/http_status";
import type JwtPayload from "@models/jwt.model";
import Users from "@sequelize/models/Users.model";

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
              `Can't find user ${userLog.email as string}`
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
            expiresIn: "15m",
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
              email: user.email,
              access_lvl: user.access_lvl,
              nick_name: user.nick_name,
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
    .then(async (selectedUser) => {
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
          expiresIn: "30m",
        });
        const newRefreshToken = jwt.sign({ email: selectedUser.email }, process.env.REFRESH_TOKEN_SECRET as string, {
          expiresIn: "1d",
        });
        selectedUser.refresh_token = newRefreshToken;
        await selectedUser.save();
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
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

const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;

  Users.findOne({
    where: {
      refresh_token: cookies.jwt,
    },
  })
    .then(async (selectedUser) => {
      if (selectedUser === null) {
        return res
          .status(httpStatus.FORBIDDEN.code)
          .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Forbidden"));
      }
      selectedUser.refresh_token = null;
      await selectedUser.save();
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "User logged out"));
    })
    .catch((error) => {
      console.log(error);
    });
};

export { login, refreshJWTToken, logout };
