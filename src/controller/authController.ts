import { db } from "../database/db";
import { Response, Request } from "express";
import ResponseMessage from "../model/ResponeMessage";
import Secure from "../utils/secureUtils";

class authController {
  async signin(req: Request, res: Response) {
    const body = req.body;
    let result: ResponseMessage = {
      data: null,
      message: "Invalid Username or Password",
      status: 401,
    };

    // validate
    let data = await db.user.findFirst({
      where: { username: body.username, password: body.password },
    });
    if (data !== null) {
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

    const data = await db.user.create({
      data: body,
    });

    const result: ResponseMessage = {
      data: {
        user_data: {
          email: data.email,
          username: data.username,
          password: Secure.hashPassword(data.password),
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
