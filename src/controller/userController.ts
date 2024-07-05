import { Request, Response } from "express";
import { db } from "../database/db";
import ResponseMessage from "../model/ResponeMessage";

class userController {
  async get_users(_req: Request, res: Response) {
    const data = await db.user.findMany();
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async get_user(req: Request, res: Response) {
    const id = req.params.id;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    const data = await db.user.findFirst({ where: { id: parseInt(id) } });
    if (data)
      result = {
        data: data,
        message: "Success",
        status: 200,
      };

    res.status(result.status).json(result).send();
  }

  async post_user(req: Request, res: Response) {
    const body = req.body;

    const data = await db.user.create({ data: body });
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 201,
    };

    res.status(result.status).json(result).send();
  }

  async put_user(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if ((await db.user.findFirst({ where: { id: parseInt(id) } })) == null) {
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await db.user.update({
        where: { id: parseInt(id) },
        data: body,
      }),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async delete_user(req: Request, res: Response) {
    const id = req.params.id;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if ((await db.user.findFirst({ where: { id: parseInt(id) } })) == null) {
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await db.user.delete({ where: { id: parseInt(id) } }),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }
}

export default userController;
