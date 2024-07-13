import { NextFunction, Request, Response } from "express";
import Secure from "../utils/secureUtils";
import grubService from "../service/grubService";
import helper from "../utils/helper";
import secureMiddleware from "./secureMiddleware";

class usegrubMiddleware {
  static async validateGrubOwnership(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = Secure.extractToken(req);
    const grub_uuid = req.params.uuid;

    if (await secureMiddleware.checkIsAdmin(req, res, next)) {
      next();
      return;
    }

    // validate
    // check if grub exist
    if (!(await grubService.isGrubExist(grub_uuid))) {
      helper.sendErrorResponse(res, "Grub not found", 404);
      return;
    }
    // check i am the owner of the grub
    if (!(await grubService.isOwnerGrubByToken(grub_uuid, token!))) {
      helper.sendErrorResponse(res, "You are not the owner of this grub", 401);
      return;
    }

    next();
  }
}

export default usegrubMiddleware;
