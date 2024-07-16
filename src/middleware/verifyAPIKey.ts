import { type Response, type Request, type NextFunction } from "express";

import ResponseController from "@controllers/response_controller";
import httpStatus from "@db/http_status";

const verifyAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers["x-api-key"];

  if (!apiKeyHeader) {
    return res
      .status(httpStatus.UNAUTHORAIZED.code)
      .send(new ResponseController(httpStatus.UNAUTHORAIZED.code, httpStatus.UNAUTHORAIZED.status, "Missing Headers"));
  }
  if (apiKeyHeader !== process.env.API_KEY) {
    return res
      .status(httpStatus.UNAUTHORAIZED.code)
      .send(
        new ResponseController(
          httpStatus.UNAUTHORAIZED.code,
          httpStatus.UNAUTHORAIZED.status,
          "Forbidden - wrong api key"
        )
      );
  }
  next();
};

export default verifyAPIKey;
