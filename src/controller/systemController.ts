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

  get_random(_req: Request, res: Response) {
    const data = Math.floor(Math.random() * 100);
    const message: ResponseMessage = {
      data: data,
      message: "Success",
      status: res.statusCode,
    };

    res.json(message).send();
  }
}

export default systemController;
