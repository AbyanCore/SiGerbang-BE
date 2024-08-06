import { NextFunction, Request, Response } from "express";
import Secure from "../utils/secureUtils";
import betterlog, { LOG_COLOR } from "../utils/betterlog";
import helper from "../utils/helper";
import userService from "../service/userService";

class secureMiddleware {
  static async checkToken(req: Request, res: Response, next: NextFunction) {
    const token = Secure.extractToken(req)!;

    // finding token
    if (!token) {
      betterlog(
        "Auth",
        "Unauthorized access from: " + req.ip + " reason no token found",
        LOG_COLOR.RED
      );
      helper.sendErrorResponse(res, "Unauthorized", 401);
      return;
    }

    // validate token
    if (!Secure.validateToken(token) && !Secure.verifyToken(token)) {
      betterlog(
        "Auth",
        "Unauthorized access from: " + req.ip + " reason token not valid",
        LOG_COLOR.RED
      );
      helper.sendErrorResponse(res, "Unauthorized", 401);
      return;
    }

    next();
  }

  static async checkIsAdmin(req: Request, res: Response, next: NextFunction) {
    const token = Secure.extractToken(req)!;
    const user = await userService.getUserByToken(token);

    if (user?.username != "admin") {
      helper.sendErrorResponse(res, "You are not an admin", 401);
      return false;
    }

    next();
    return true;
  }
}

export default secureMiddleware;
