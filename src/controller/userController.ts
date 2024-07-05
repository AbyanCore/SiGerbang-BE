import { Request, Response } from "express";
import ResponseMessage from "../model/ResponeMessage";
import userService from "../service/userService";

class userController {
  async get_users(_req: Request, res: Response) {
    const data = await userService.getUsers();
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async get_user(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    const data = await userService.getUserById(id);
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

    const data = await userService.createUser(body);
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 201,
    };

    res.status(result.status).json(result).send();
  }

  async put_user(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if (await userService.isUserExist(id)) {
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await userService.updateUser(id, body),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async delete_user(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    if (await userService.getUserById(id)) {
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await userService.deleteUser(id),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }
}

export default userController;
