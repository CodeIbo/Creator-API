import { type Response, type Request } from "express";

import ResponseController from "./response_controller";
import httpStatus from "@db/http_status";
import { isUpdateSettingsObject } from "@guards/settings_guard";
import Settings from "@sequelize/models/Settings.model";

export const getSettingsById = async (req: Request, res: Response) => {
  const id = req.params.id;
  await Settings.findOne({
    where: {
      id,
    },
  })
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Settings", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Settings not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const getDefaultSetting = async (req: Request, res: Response) => {
  await Settings.findOne()
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Default Setting", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Default Setting not founded use ID"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const getSettings = async (req: Request, res: Response) => {
  await Settings.findAll()
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Settings", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Settings not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const updateSettings = async (req: Request, res: Response) => {
  const settingObj = req.body;
  const id = req.params.id;

  if (!isUpdateSettingsObject(settingObj)) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  } else {
    await Settings.update(settingObj, { where: { id } }).catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });

    const settingsItem = await Settings.findOne({ where: { id } });
    if (settingsItem) {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Settings updated`, settingsItem.get()));
    } else {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Settings update fail`));
    }
  }
};
