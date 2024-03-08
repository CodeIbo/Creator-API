import httpStatus from "@db/http_status";
import ResponseController from "./response_controller";
import { type Response, type Request } from "express";
import { addNewUrl, deleteUrlObject, getUrlById, getUrlsByCategory, updateUrlObject } from "./url_controller";
import Podcasts from "@db/models/Podcasts.model";
import _ from "lodash";
import { keysFilter } from "@src/helpers/key.helper";
import { isNewPodcastObject, isUpdatePodcastObject } from "@src/guards/podcast_guard";

export const getPodcasts = (_req: Request, res: Response): void => {
  getUrlsByCategory("podcast")
    .then((data) => {
      if (data.status) {
        Podcasts.findAll()
          .then((podcast) => {
            const updatedPodcasts = podcast.map((podcast) => {
              const urlList = data.data.filter((url) => {
                return url.id === podcast.id;
              });
              let updatedPodcast = podcast.get();

              urlList.forEach((urlObj) => {
                updatedPodcast = _.defaults(updatedPodcast, urlObj.get());
              });
              return updatedPodcast;
            });
            return res
              .status(httpStatus.OK.code)
              .send(
                new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Podcasts", updatedPodcasts)
              );
          })
          .catch((err) => {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
          });
      } else {
        return res
          .status(httpStatus.NOT_FOUND.code)
          .send(
            new ResponseController(
              httpStatus.NOT_FOUND.code,
              httpStatus.NOT_FOUND.status,
              `Found ${data.data.length} items in podcast category`
            )
          );
      }
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
    });
};

export const getPodcast = (req: Request, res: Response): void => {
  getUrlById(req.params.id)
    .then((data) => {
      if (data.status) {
        Podcasts.findOne({ where: { id: req.params.id } })
          .then((podcast) => {
            if (podcast !== null && data.data) {
              return res
                .status(httpStatus.OK.code)
                .send(
                  new ResponseController(
                    httpStatus.OK.code,
                    httpStatus.OK.status,
                    "Podcast received",
                    _.defaults(podcast.get({ plain: true }), data.data.get({ plain: true }))
                  )
                );
            }
          })
          .catch((err) => {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Error", err));
          });
      }
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
    });
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
