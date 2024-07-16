import jwt from "jsonwebtoken";
import { type Response, type Request, type NextFunction } from "express";

import httpStatus from "@db/http_status";
import ResponseController from "@controllers/response_controller";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(httpStatus.UNAUTHORAIZED.code)
      .send(new ResponseController(httpStatus.UNAUTHORAIZED.code, httpStatus.UNAUTHORAIZED.status, "Missing Headers"));
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err ?? !decoded) {
        res
          .status(httpStatus.FORBIDDEN.code)
          .send(new ResponseController(httpStatus.FORBIDDEN.code, httpStatus.FORBIDDEN.status, "Forbidden"));
      } else {
        next();
      }
    });
  }
};

export default verifyJWT;
