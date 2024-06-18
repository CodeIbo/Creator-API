import httpStatus from "@db/http_status";
import UISettings from "@db/models/UISettings.model";
import { type Request, type Response } from "express";
import ResponseController from "./response_controller";
import { isUISettingsMediaObject } from "@src/guards/uiSetting_guard";

export const getUISettings = async (req: Request, res: Response) => {
  await UISettings.findAll().then((data) => {
    if (data) {
      const convertedListSettings: any = {};
      data.forEach((row) => {
        const type = row.element_type;
        convertedListSettings[type] = {
          ...convertedListSettings[type],
          [row.element_key]: {
            css: row.element_css,
            value: row.element_value,
          },
        };
      });
      return res
        .status(httpStatus.OK.code)
        .send(
          new ResponseController(
            httpStatus.OK.code,
            httpStatus.OK.status,
            "Found List of UI Settings",
            convertedListSettings
          )
        );
    }
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "UI  Settings not founded"));
  });
};

export const getUISettingsForPanel = async (req: Request, res: Response) => {
  await UISettings.findAll().then((data) => {
    if (data) {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found List of UI Settings", data));
    }
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "UI  Settings not founded"));
  });
};

export const getUISettingForPanel = async (req: Request, res: Response) => {
  const id = req.params.id;
  await UISettings.findOne({ where: { id } }).then((data) => {
    if (data) {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found UI Setting", data));
    }
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "UI  Setting not founded"));
  });
};

export const updateUISettings = async (req: Request, res: Response) => {
  const updateUISetting = req.body;
  const id = req.params.id;
  if (!isUISettingsMediaObject(updateUISetting)) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  }
  UISettings.update(updateUISetting, { where: { id } })
    .then(async () => {
      return await UISettings.findByPk(id);
    })
    .then((uiSettingID) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Updated`, uiSettingID));
    })
    .catch((_err) => {
      return res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `UI Setting item by id ${id} was not found`,
            _err
          )
        );
    });
};
