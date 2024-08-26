import _ from "lodash";
import { type Response, type Request } from "express";

import { getUrlById, getUrls } from "./url_controller";
import ResponseController from "./response_controller";
import Menu from "@sequelize/models/Menu.model";
import httpStatus from "@db/http_status";
import { isNewMenuObject, isUpdatedMenuObject } from "@guards/menu_guard";
import { flattenMenu, structureMenu, type MenuWithChildren } from "@src/helpers/menu.helper";

export const getMenuItem = (req: Request, res: Response): void => {
  const id = req.params.id;

  Menu.findOne({ where: { id } })
    .then((menu) => {
      if (menu !== null) {
        if (menu.url_id) {
          getUrlById(menu.url_id)
            .then((data) => {
              const urlObject = data.data?.get();
              if (data.status && urlObject) {
                return res.status(httpStatus.OK.code).send(
                  new ResponseController(
                    httpStatus.OK.code,
                    httpStatus.OK.status,
                    "Menu Item Received",
                    _.defaults(menu.get({ plain: true }), {
                      url: urlObject.url,
                      page_category: urlObject.page_category,
                    })
                  )
                );
              }
            })
            .catch((err) =>
              res
                .status(httpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                  new ResponseController(
                    httpStatus.INTERNAL_SERVER_ERROR.code,
                    httpStatus.INTERNAL_SERVER_ERROR.status,
                    "Internal error",
                    err
                  )
                )
            );
        } else {
          return res
            .status(httpStatus.OK.code)
            .send(
              new ResponseController(
                httpStatus.OK.code,
                httpStatus.OK.status,
                "Menu Item Received",
                menu.get({ plain: true })
              )
            );
        }
      } else {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(
            new ResponseController(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              "Cannot find menu item"
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

export const getMenuItems = (req: Request, res: Response): void => {
  getUrls()
    .then((data) => {
      if (data.status) {
        Menu.findAll({ order: [["menu_order", "ASC"]] })
          .then((menus) => {
            const updatedMenuItems = menus.map((menu) => {
              const urlList = data.data.filter((url) => {
                return url.id === menu.url_id;
              });
              let updatedMenuItem = menu.get();
              urlList.forEach((urlObject) => {
                updatedMenuItem = _.defaults(updatedMenuItem, {
                  url: urlObject.url,
                  page_category: urlObject.page_category,
                });
              });
              return updatedMenuItem;
            });
            const menuWithChildren = structureMenu(updatedMenuItems);
            return res
              .status(httpStatus.OK.code)
              .send(
                new ResponseController(httpStatus.OK.code, httpStatus.OK.status, "Found Menu Items", menuWithChildren)
              );
          })
          .catch((err) => {
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
          });
      }
    })
    .catch((err) => {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, err));
    });
};

export const createMenuItem = (req: Request, res: Response): void => {
  const newMenuItem = req.body;
  if (!isNewMenuObject(newMenuItem)) {
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
    Menu.create(newMenuItem)
      .then((menuItem) => {
        return res
          .status(httpStatus.CREATED.code)
          .send(
            new ResponseController(httpStatus.CREATED.code, httpStatus.CREATED.status, "New Menu Item added", menuItem)
          );
      })
      .catch((err) => {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(
            new ResponseController(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              "Failed to add Menu Item",
              err
            )
          );
      });
  }
};

export const updatedMenuItem = async (req: Request, res: Response) => {
  const updateMenuItem = req.body;
  const id = req.params.id;
  if (!isUpdatedMenuObject(updateMenuItem)) {
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
  Menu.update(updateMenuItem, { where: { id } })
    .then(async () => {
      return await Menu.findByPk(id);
    })
    .then((menuItem) => {
      return res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Added`, menuItem));
    })
    .catch((_err) => {
      return res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new ResponseController(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Menu by id ${id} was not found`,
            _err
          )
        );
    });
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const affectedRows = await Menu.destroy({ where: { id: req.params.id } })
    .then((affRows) => affRows)
    .catch((_err) => _err);

  return typeof affectedRows === "number" && affectedRows > 0
    ? res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Menu item deleted`))
    : res
        .status(httpStatus.OK.code)
        .send(new ResponseController(httpStatus.OK.code, httpStatus.OK.status, `Failed menu item delete`));
};

export const sortMenuItems = async (req: Request, res: Response) => {
  const menuItems: MenuWithChildren[] | undefined = req.body.menuItems;
  if (!menuItems) {
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
      const flattedMenu = flattenMenu(menuItems);
      await Promise.all(
        flattedMenu.map(
          async (menuItem) =>
            await Menu.update(
              { menu_order: menuItem.menu_order, parent_id: menuItem.parent_id },
              { where: { id: menuItem.id } }
            )
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
