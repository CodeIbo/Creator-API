import _ from "lodash";
import { type Response, type Request } from "express";

import ResponseController from "./response_controller";
import httpStatus from "@db/http_status";
import { keysFilter } from "@helpers/key.helper";
import { isNewUrlObject, isUpdateUrlObject } from "@guards/url_guard";
import Urls, { type pageCategory } from "@sequelize/models/Urls.model";

export const getUrlsByCategory = async (category: pageCategory) => {
  const urls = await Urls.findAll({
    where: {
      page_category: category,
    },
  });
  return {
    status: urls.length >= 0,
    data: urls,
  };
};

export const getUrls = async () => {
  const urls = await Urls.findAll();
  return {
    status: urls.length >= 0,
    data: urls,
  };
};

export const getUrlById = async (urlId: string) => {
  const url = await Urls.findOne({
    where: {
      id: urlId,
    },
  });
  return {
    status: !!url,
    data: url ?? null,
    err: url ? null : "Cannot find Url",
  };
};

export const addNewUrl = async (newUrlObject: any) => {
  const urlKeys = keysFilter(Urls, ["id", "created_at"], false);
  const filteredObject = _.pickBy(newUrlObject, (v: any, k: string) => {
    return urlKeys.includes(k);
  });
  if (isNewUrlObject(filteredObject)) {
    try {
      const newUrl = await Urls.create(filteredObject);
      return {
        status: true,
        data: newUrl,
      };
    } catch (error) {
      return {
        status: false,
        err: "Error creating URL",
      };
    }
  } else {
    return {
      status: false,
      err: "Data error",
    };
  }
};

export const updateUrlObject = async (urlUpdateObject: any, urlId: string) => {
  const urlKeys = keysFilter(Urls, ["id", "created_at"], false);
  const filteredObject = _.pickBy(urlUpdateObject, (v: any, k: string) => {
    return urlKeys.includes(k);
  });
  if (isUpdateUrlObject(filteredObject)) {
    const updateUrl = await Urls.update(filteredObject, { where: { id: urlId } })
      .then((affectedRows) => affectedRows[0])
      .catch((_err) => {
        return {
          status: false,
          err: "Can't update",
        };
      });
    if (typeof updateUrl === "number" && updateUrl >= 0) {
      const updatedUrl = Urls.findOne({ where: { id: urlId } });
      return {
        status: true,
        data: updatedUrl,
      };
    }
  }
  return {
    status: true,
  };
};

export const deleteUrlObject = async (urlId: string) => {
  const affectedRows = await Urls.destroy({ where: { id: urlId } })
    .then((affRows) => affRows)
    .catch((_err) => {
      console.log(_err);
    });

  return {
    status: typeof affectedRows === "number" && affectedRows > 0,
    err: typeof affectedRows === "number" && affectedRows > 0 ? null : "Delete failed",
  };
};

// endpoints

export const endpointGetUrls = async (req: Request, res: Response): Promise<void> => {
  getUrls()
    .then((data) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Urls", data.data));
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
    });
};
