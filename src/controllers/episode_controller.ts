import httpStatus from "@db/http_status";
import _ from "lodash";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import Episodes from "@db/models/Episodes.model";
import { isNewEpisodeObject, isUpdateEpisodeObject } from "@src/guards/episode_guard";

export const getEpisodesByKey = async (req: Request, res: Response) => {
  const podcastKey = req.query.podcast_key;
  if (_.isString(podcastKey)) {
    await Episodes.findAll({
      where: {
        podcast_key: podcastKey,
      },
    })
      .then((data) => {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Founded Episodes", data));
      })
      .catch((err) => {
        return res
          .status(httpStatus.BAD_REQUEST.code)
          .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Error", err));
      });
  } else {
    return res
      .status(httpStatus.BAD_REQUEST.code)
      .send(new ResponseController(httpStatus.BAD_REQUEST.code, httpStatus.BAD_REQUEST.status, "Error Query Params"));
  }
};

export const getEpisode = async (req: Request, res: Response) => {
  const id = req.params.id;
  await Episodes.findOne({
    where: {
      id,
    },
  })
    .then((data) => {
      if (data) {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Episode", data));
      }
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Episode not founded"));
    })
    .catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });
};

export const createEpisode = (req: Request, res: Response) => {
  const newEpisode = req.body;

  if (!isNewEpisodeObject(newEpisode)) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          `No valid data`
        )
      );
  } else {
    Episodes.create(newEpisode)
      .then((episode) => {
        return res
          .status(httpStatus.OK.code)
          .send(
            new ResponseController(
              httpStatus.OK.code,
              httpStatus.OK.status,
              `New Episode added`,
              _.defaults(episode.get())
            )
          );
      })
      .catch((err) => {
        return res
          .status(httpStatus.OK.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
      });
  }
};

export const updateEpisode = async (req: Request, res: Response) => {
  const updateEpisodeObject = req.body;
  const id = req.params.id;

  if (!isUpdateEpisodeObject(updateEpisodeObject)) {
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
    await Episodes.update(updateEpisodeObject, { where: { id } }).catch((err) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
    });

    const updatedEpisode = await Episodes.findOne({ where: { id } });
    if (updatedEpisode) {
      return res
        .status(httpStatus.OK.code)
        .send(
          new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Episode Updated`, updatedEpisode.get())
        );
    } else {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Episode update fail`));
    }
  }
};

export const deleteEpisode = async (req: Request, res: Response) => {
  const affectedRows = await Episodes.destroy({ where: { id: req.params.id } })
    .then((affRows) => affRows)
    .catch((_err) => _err);

  return typeof affectedRows === "number" && affectedRows > 0
    ? res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Episode deleted`))
    : res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Failed episode delete`));
};
