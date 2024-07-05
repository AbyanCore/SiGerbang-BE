import { db } from "../database/db";
import { Response, Request } from "express";
import ResponseMessage from "../model/ResponeMessage";
import { randomUUID } from "crypto";

class grubController {
  async get_grubs(req: Request, res: Response) {
    const data = await db.grub.findMany();
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async get_grub(req: Request, res: Response) {
    const id = req.params.id;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    const data = await db.grub.findFirst({ where: { uuid: id } });
    if (data)
      result = {
        data: data,
        message: "Success",
        status: 200,
      };

    res.status(result.status).json(result).send();
  }

  async post_grub(req: Request, res: Response) {
    const body = req.body;

    const data = await db.grub.create({
      data: {
        uuid: randomUUID(),
        ...body,
      },
    });
    const result: ResponseMessage = {
      data: { data },
      message: "Success",
      status: 201,
    };

    res.status(result.status).json(result).send();
  }

  async put_grub(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if ((await db.grub.findFirst({ where: { uuid: id } })) == null) {
      res.status(result.status).json(result).send();
      return;
    }
    // execute
    result = {
      data: await db.grub.update({
        where: { uuid: id },
        data: body,
      }),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async delete_grub(req: Request, res: Response) {
    const id = req.params.id;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if ((await db.grub.findFirst({ where: { uuid: id } })) == null) {
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await db.grub.delete({ where: { uuid: id } }),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }
}

export default grubController;
