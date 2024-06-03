import { type Response, type Request } from "express";
import SocialMedia, { type SocialMediaSortAtributes } from "@db/models/SocialMedia.model";
import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { isUpdateSocialMediaObject } from "@guards/socialMedia_guard";

export const getSocialMediaById = async (req: Request, res: Response) => {
  const id = req.params.id;
  await SocialMedia.findOne({
    where: {
      id,
    },
  })
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Social Media", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Social Media not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const getListSocialMedia = async (req: Request, res: Response) => {
  await SocialMedia.findAll({ order: [["order", "ASC"]] })
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found List of Social Media", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Social Media List not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const updateSocialMedia = async (req: Request, res: Response) => {
  const updateSocialMediaObject = req.body;
  const id = req.params.id;

  if (!isUpdateSocialMediaObject(updateSocialMediaObject)) {
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
    await SocialMedia.update(updateSocialMediaObject, { where: { id } }).catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });

    const socialMediaItem = await SocialMedia.findOne({ where: { id } });
    if (socialMediaItem) {
      return res
        .status(httpStatus.OK.code)
        .send(
          new ResponseController(
            httpStatus.OK.code,
            httpStatus.OK.status,
            `SocialMedia Item Updated`,
            socialMediaItem.get()
          )
        );
    } else {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `SocialMedia Item update fail`));
    }
  }
};

export const sortSocialMedia = async (req: Request, res: Response) => {
  const socialMediaItems: SocialMediaSortAtributes[] | undefined = req.body.socialMedia;
  if (!socialMediaItems) {
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
    try {
      await Promise.all(
        socialMediaItems.map(
          async (item) => await SocialMedia.update({ order: item.order }, { where: { id: item.id } })
        )
      );
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Items Sorted`));
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new ResponseController(
            httpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus.INTERNAL_SERVER_ERROR.status,
            `Error when updates`,
            err
          )
        );
    }
  }
};
