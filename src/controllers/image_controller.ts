import httpStatus from "@db/http_status";
import Images from "@db/models/Images.model";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const uploadImage = async (req: Request, res: Response) => {
  const file = req?.file;
  if (!file) {
    return res
      .status(httpStatus.BAD_REQUEST.code)
      .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "BAD_REQUEST"));
  }
  path.extname(file.filename);
  if (path.extname(file.filename) !== ".svg" && path.extname(file.filename) !== ".webp") {
    const outputFilePath = file.path.replace(path.extname(file.filename), ".webp");
    await sharp(file.path)
      .resize()
      .webp({ quality: 80 })
      .toFile(outputFilePath)
      .catch((err) => {
        return res
          .status(httpStatus.BAD_REQUEST.code)
          .send(
            new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Convert Failed", err)
          );
      });
    fs.unlinkSync(file.path);
    file.path = outputFilePath;
    file.filename = path.basename(outputFilePath);
  }
  Images.create({
    file_name: file.filename,
    file_path: file.path,
    mine_type: file.mimetype,
    original_name: file.originalname.split(".").slice(0, -1).join("."),
    size: file.size,
  })
    .then((newImage) => {
      return res
        .status(httpStatus.CREATED.code)
        .send(new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, "Created", newImage));
    })
    .catch((e) => {
      console.log(e);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(
            httpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus.INTERNAL_SERVER_ERROR.status,
            "Failed when added to db",
            e
          )
        );
    });
};

export const getImage = async (req: Request, res: Response) => {
  const imageName = req.params.id;
  Images.findOne({
    where: {
      id: imageName,
    },
  })
    .then((image) => {
      if (!image) {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(new ResponseController(httpStatus.NOT_FOUND.code, httpStatus.NOT_FOUND.status, "Not Found"));
      }
      if (!fs.existsSync(image.file_path)) {
        return res
          .status(httpStatus.BAD_REQUEST.code)
          .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "File not found"));
      }
      res.type(image.mine_type);
      res.sendFile(image.file_path, { root: "." }, (error) => {
        if (error) {
          if (!res.headersSent) {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  error.message,
                  error
                )
              );
          } else {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new ResponseController(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  "Failed to send file after headers were sent",
                  error
                )
              );
          }
        }
      });
    })
    .catch((e) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(
            httpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus.INTERNAL_SERVER_ERROR.status,
            "Database Error",
            e
          )
        );
    });
};

export const getImages = async (req: Request, res: Response) => {
  Images.findAll()
    .then((data) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Images found`, data));
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(
            httpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus.INTERNAL_SERVER_ERROR.status,
            `Failed to find images`,
            err
          )
        );
    });
};

export const deleteImage = async (req: Request, res: Response) => {
  const affectedRows = await Images.destroy({ where: { id: req.params.id }, individualHooks: true })
    .then((affRows) => affRows)
    .catch((_err) => _err);
  return typeof affectedRows === "number" && affectedRows > 0
    ? res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Image deleted`))
    : res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Failed Image delete`));
};
