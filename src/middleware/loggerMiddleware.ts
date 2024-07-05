import { Request, Response, NextFunction } from "express";
import betterlog from "../utils/betterlog";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  betterlog("Log", `${req.ip} ${req.method} ${req.url}`);
  next();
};

export default loggerMiddleware;
