import { Request, Response } from "express";
import ResponseMessage from "../model/ResponeMessage";

class systemController {
  index(res: Response) {
    const message: ResponseMessage = {
      data: null,
      message: "Welcome to my API",
      status: res.statusCode,
    };
    res.json(message).send();
  }

  get_time(_req: Request, res: Response) {
    const data = new Date();
    const message: ResponseMessage = {
      data: data,
      message: "Success",
      status: res.statusCode,
    };

    res.json(message).send();
  }

  get_random(req: Request, res: Response) {
    const min = req.query.min ? parseInt(req.query.min as string) : 0;
    const max = req.query.max ? parseInt(req.query.max as string) : 100;

    const data = Math.floor(Math.random() * (max - min + 1) + min);
    const message: ResponseMessage = {
      data: data,
      message: "Success",
      status: res.statusCode,
    };

    res.json(message).send();
  }
}

export default systemController;
