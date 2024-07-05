import { Response, Request } from "express";
import ResponseMessage from "../model/ResponeMessage";
import grubService from "../service/grubService";
import Secure from "../utils/secureUtils";
import usergrubService from "../service/usergrubService";
import userService from "../service/userService";

class grubController {
  async get_grubs(req: Request, res: Response) {
    const data = await grubService.getGrubs();
    const result: ResponseMessage = {
      data: data,
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async get_grub(req: Request, res: Response) {
    const uuid = req.params.uuid;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    const data = await grubService.getGrubByUuid(uuid);
    if (data)
      result = {
        data: data,
        message: "Success",
        status: 200,
      };

    res.status(result.status).json(result).send();
  }

  async post_grub(req: Request, res: Response) {
    const body = {
      author: (await userService.getUserByToken(Secure.extractToken(req)!))?.id,
      ...req.body,
    };
    let result: ResponseMessage = {
      message: "Error",
      data: null,
      status: 400,
    };

    // execute
    const data = await grubService.createGrub(body);
    result = {
      data: { data },
      message: "Success",
      status: 201,
    };

    // past execution
    if (data != null)
      await usergrubService.addUserToGrub(
        data.uuid,
        (
          await userService.getUserByToken(Secure.extractToken(req)!)
        )?.id!
      );

    res.status(result.status).json(result).send();
  }

  async put_grub(req: Request, res: Response) {
    const uuid = req.params.uuid;
    const body = req.body;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    // check if grub exist
    if (!(await grubService.isGrubExist(uuid))) {
      res.status(result.status).json(result).send();
      return;
    }
    // check if user is owner of grub
    if (
      !(await grubService.isOwnerGrubByToken(Secure.extractToken(req)!, uuid))
    ) {
      result.message = "You are not the owner of this grub";
      result.status = 401;
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await grubService.updateGrub(uuid, body),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async delete_grub(req: Request, res: Response) {
    const uuid = req.params.uuid;

    let result: ResponseMessage = {
      message: "Data not found",
      data: null,
      status: 404,
    };

    // validate
    // check if grub exist
    if ((await grubService.isGrubExist(uuid)) == null) {
      res.status(result.status).json(result).send();
      return;
    }
    // check if user is owner of grub
    if (
      (await grubService.isOwnerGrubByToken(Secure.extractToken(req)!, uuid)) ==
      null
    ) {
      result.message = "You are not the owner of this grub";
      result.status = 401;
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await grubService.deleteGrub(uuid),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }
}

export default grubController;
