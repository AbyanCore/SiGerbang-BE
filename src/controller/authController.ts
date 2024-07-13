import { db } from "../database/db";
import { Response, Request } from "express";
import ResponseMessage from "../model/ResponeMessage";
import Secure from "../utils/secureUtils";
import userService from "../service/userService";
import helper from "../utils/helper";

class authController {
  async signin(req: Request, res: Response) {
    const body = req.body;
    let result: ResponseMessage = {
      data: null,
      message: "Invalid Username or Password",
      status: 401,
    };

    // validate
    if (!body.username || !body.password) {
      helper.sendErrorResponse(res, "Invalid Username or Password", 401);
      return;
    }

    let data = await db.user.findFirst({
      where: {
        username: body.username,
        password: Secure.hashPassword(body.password),
      },
    });
    if (data != null) {
      delete (data as any).created_at;
      delete (data as any).updated_at;
      delete (data as any).password;

      result = {
        data: {
          user_data: data,
          token: Secure.generateToken(data.id),
        },
        message: "Signin Success",
        status: 200,
      };

      res.cookie("token", result.data.token, {
        maxAge: 1000,
      });
    }

    res.status(result.status).json(result).send();
  }

  async signup(req: Request, res: Response) {
    const body = req.body;

    // validate
    // check input is valid
    if (!body.email || !body.username || !body.password) {
      helper.sendErrorResponse(res, "Invalid input", 400);
      return;
    }
    // check if email already exist
    if (await userService.isUserExistByEmail(body.email)) {
      helper.sendErrorResponse(res, "Email already exist", 400);
      return;
    }

    const data = await db.user.create({
      data: {
        ...body,
        password: Secure.hashPassword(body.password),
      },
    });

    const result: ResponseMessage = {
      data: {
        user_data: {
          email: data.email,
          username: data.username,
        },
        token: Secure.generateToken(data.id),
      },
      message: "Success",
      status: 201,
    };

    res.cookie("token", result.data.token, {
      maxAge: 1000,
    });

    res.status(result.status).json(result).send();
  }
}

export default authController;
