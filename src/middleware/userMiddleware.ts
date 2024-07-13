import { NextFunction, Request, Response } from "express";
import Secure from "../utils/secureUtils";
import userService from "../service/userService";
import helper from "../utils/helper";
import secureMiddleware from "./secureMiddleware";

class userMiddleware {
  static async checkIsOwner(req: Request, res: Response, next: NextFunction) {
    const token = Secure.extractToken(req)!;
    const user = await userService.getUserByToken(token);

    if (await secureMiddleware.checkIsAdmin(req, res, next)) {
      next();
      return;
    }

    if (user?.id != parseInt(req.params.id)) {
      helper.sendErrorResponse(
        res,
        "You are not the owner of this account",
        401
      );
      return;
    }

    next();
  }
}

export default userMiddleware;
