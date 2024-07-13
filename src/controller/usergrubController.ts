import ResponseMessage from "../model/ResponeMessage";
import { Request, Response } from "express";
import Secure from "../utils/secureUtils";
import userService from "../service/userService";
import grubService from "../service/grubService";
import usergrubService from "../service/usergrubService";

class usergrubController {
  async get_usersInGrub(req: Request, res: Response) {
    const grub_uuid = req.params.uuid;

    let result: ResponseMessage = {
      data: null,
      message: "Not Found",
      status: 404,
    };

    // validate
    // check if grub exist
    if (!(await grubService.isGrubExist(grub_uuid))) {
      result.message = "Grub not found";
      res.status(result.status).json(result).send();
      return;
    }
    // check is i am in the grub
    if (
      !(await usergrubService.isUserInGrubByUserToken(
        grub_uuid,
        Secure.extractToken(req)!
      ))
    ) {
      result.message = "You are not in this grub";
      result.status = 401;
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await usergrubService.getUsersInGrub(grub_uuid),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async get_userInGrub(req: Request, res: Response) {
    const grub_uuid = req.params.uuid || "";
    const user_id = parseInt(req.body.userid) || -1;

    let result: ResponseMessage = {
      data: null,
      message: "Invalid grub uuid or user id",
      status: 404,
    };

    // validate
    // check is i am in the grub
    if (
      !(await usergrubService.isUserInGrubByUserToken(
        grub_uuid,
        Secure.extractToken(req)!
      ))
    ) {
      result.message = "You are not in this grub";
      result.status = 401;
      res.status(result.status).json(result).send();
      return;
    }
    // check if user and grub exist
    if (!(await userService.isUserExist(user_id!))) {
      result.message = "User not found";
      res.status(result.status).json(result).send();
      return false;
    }
    if (!(await grubService.isGrubExist(grub_uuid!))) {
      result.message = "Grub not found";
      res.status(result.status).json(result).send();
      return false;
    }

    // check if user already in grub
    const userInGrub = await usergrubService.isUserInGrubByUserId(
      grub_uuid,
      user_id
    );
    if (userInGrub == null) {
      result.message = "User not in grub";
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: userInGrub,
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async add_userToGrub(req: Request, res: Response) {
    const grub_uuid = req.params.uuid;
    const user_id = parseInt(req.body.userid);

    let result: ResponseMessage = {
      data: null,
      message: "Invalid grub uuid or user id",
      status: 404,
    };

    // validate
    // check if user exist
    if (!(await userService.isUserExist(user_id!))) {
      result.message = "User not found";
      res.status(result.status).json(result).send();
      return false;
    }
    // check if user already in grub
    const userInGrub = await usergrubService.isUserInGrubByUserId(
      grub_uuid,
      user_id
    );
    if (userInGrub) {
      result.message = "User already in grub";
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await usergrubService.addUserToGrub(grub_uuid, user_id),
      message: "Success",
      status: 201,
    };

    res.status(result.status).json(result).send();
  }

  async remove_userFromGrub(req: Request, res: Response) {
    const grub_uuid = req.params.uuid;
    const user_id = parseInt(req.body.userid);

    let result: ResponseMessage = {
      data: null,
      message: "Invalid grub uuid or user id",
      status: 404,
    };

    // validate
    // check if user exist
    if (!(await userService.isUserExist(user_id!))) {
      result.message = "User not found";
      res.status(result.status).json(result).send();
      return false;
    }
    // check if user already in grub
    const userInGrub = await usergrubService.isUserInGrubByUserId(
      grub_uuid,
      user_id
    );
    if (userInGrub == null) {
      result.message = "User not in grub";
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await usergrubService.removeUserFromGrub(grub_uuid, user_id),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }

  async update_userRoleInGrub(req: Request, res: Response) {
    const grub_uuid = req.params.uuid;
    const user_id = parseInt(req.body.userid);
    const role = req.body.role;

    let result: ResponseMessage = {
      data: null,
      message: "Invalid grub uuid or user id",
      status: 404,
    };

    // validate
    // check if user exist
    if (!(await userService.isUserExist(user_id!))) {
      result.message = "User not found";
      res.status(result.status).json(result).send();
      return false;
    }
    // check if user already in grub
    const userInGrub = await usergrubService.isUserInGrubByUserId(
      grub_uuid,
      user_id
    );
    if (userInGrub == null) {
      result.message = "User not in grub";
      res.status(result.status).json(result).send();
      return;
    }

    // execute
    result = {
      data: await usergrubService.updateUserRoleInGrub(
        grub_uuid,
        user_id,
        role
      ),
      message: "Success",
      status: 200,
    };

    res.status(result.status).json(result).send();
  }
}

export default usergrubController;
