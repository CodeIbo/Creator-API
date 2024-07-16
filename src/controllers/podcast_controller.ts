import { type Response, type Request } from "express";
import _ from "lodash";

import ResponseController from "./response_controller";
import { addNewUrl, deleteUrlObject, getUrlById, updateUrlObject } from "./url_controller";
import httpStatus from "@db/http_status";
import Podcasts from "@sequelize/models/Podcasts.model";
import { keysFilter } from "@helpers/key.helper";
import { mergeArraysWithUrls, mergeObjectWithUrl } from "@helpers/contentMerger.helper";
import { isNewPodcastObject, isUpdatePodcastObject } from "@guards/podcast_guard";

export const getPodcasts = async (_req: Request, res: Response) => {
  try {
    const podcasts = await Podcasts.findAll();
    const mergedPodcasts = await mergeArraysWithUrls<Podcasts>(podcasts, "podcast");

    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Podcasts", mergedPodcasts));
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new ResponseController(
          httpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus.INTERNAL_SERVER_ERROR.status,
          "Internal server error",
          err
        )
      );
  }
};

export const getPodcast = async (req: Request, res: Response) => {
  try {
    const podcast = await Podcasts.findOne({ where: { id: req.params.id } });
    if (!podcast) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Podcasts not found"));
    }
    const mergedBlog = await mergeObjectWithUrl<Podcasts>(podcast, req.params.id);
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Podcast received", mergedBlog));
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
  }
};

export const createPodcast = (req: Request, res: Response): void => {
  const newPodcast = req.body;
  if (!isNewPodcastObject(newPodcast)) {
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
    addNewUrl(newPodcast)
      .then((data) => {
        if (data.status && !!data.data) {
          Podcasts.create({
            id: data.data.id,
            podcast_title: newPodcast.podcast_title,
            podcast_key: newPodcast.podcast_key,
          })
            .then((podcast) => {
              return res
                .status(httpStatus.OK.code)
                .send(
                  new ResponseController(
                    httpStatus.OK.code,
                    httpStatus.OK.status,
                    `New Item added`,
                    _.defaults(podcast.get({ plain: true }), data.data.get({ plain: true }))
                  )
                );
            })
            .catch((err) => {
              return res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
            });
        } else {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR.code).send(
            new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Failed adding URL", {
              status: data.status,
              err: data.err,
            })
          );
        }
      })
      .catch((_err) => {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, _err));
      });
  }
};

export const updatePodcast = (req: Request, res: Response) => {
  const updatePodcastObj = req.body;
  if (!isUpdatePodcastObject(updatePodcastObj)) {
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
    const podcastKeys = keysFilter(Podcasts, ["id", "created_at"], false);
    const filteredObject = _.pickBy(updatePodcastObj, (v: any, k: string) => {
      return podcastKeys.includes(k);
    });
    updateUrlObject(updatePodcastObj, req.params.id)
      .then(async (data) => {
        if (data?.status && data.data) {
          if (Object.keys(filteredObject).length > 0) {
            await Podcasts.update(filteredObject, { where: { id: req.params.id } }).catch((_err) => {
              return res
                .status(httpStatus.NOT_FOUND.code)
                .send(
                  new ResponseController(
                    httpStatus.NOT_FOUND.code,
                    httpStatus.NOT_FOUND.status,
                    `Podcast by id ${req.params.id} was not found`,
                    _err
                  )
                );
            });
          }
          const updatedUrl = await getUrlById(req.params.id);
          const updatedPodcast = await Podcasts.findOne({ where: { id: req.params.id } });
          if (updatedUrl.data && updatedUrl.status && updatedPodcast) {
            return res
              .status(httpStatus.OK.code)
              .send(
                new ResponseController(
                  httpStatus.OK.code,
                  httpStatus.OK.status,
                  `Podcast Updated`,
                  _.defaults(updatedPodcast.get(), updatedUrl.data.get())
                )
              );
          }
        } else {
          return res
            .status(httpStatus.OK.code)
            .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Podcast update fail`, data));
        }
      })
      .catch((_err) => {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Podcast by id ${req.params.id} was not found`,
              _err
            )
          );
      });
  }
};

export const deletePodcast = async (req: Request, res: Response) => {
  const result = await deleteUrlObject(req.params.id);
  if (result.status) {
    return res
      .status(httpStatus.OK.code)
      .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Podcast deleted"));
  } else {
    return res
      .status(httpStatus.NOT_FOUND.code)
      .send(
        new ResponseController(
          httpStatus.NOT_FOUND.code,
          httpStatus.NOT_FOUND.status,
          `Podcast by id ${req.params.id} was not found`,
          result
        )
      );
  }
};
