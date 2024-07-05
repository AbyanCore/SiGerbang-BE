import { NextFunction, Request, Response } from "express";
import Secure from "../utils/secureUtils";
import betterlog from "../utils/betterlog";

const secureMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = Secure.extractToken(req)!;

  // finding token
  if (!token) {
    betterlog(
      "Auth",
      "Unauthorized access from: " + req.ip + " reason no token found"
    );
    res.status(401).json({ message: "Unauthorized" }).send();
    return;
  }

  // validate token
  if (!Secure.validateToken(token)) {
    betterlog(
      "Auth",
      "Unauthorized access from: " + req.ip + " reason token not valid"
    );
    res.status(401).json({ message: "Unauthorized" }).send();
    return;
  }

  next();
};

export default secureMiddleware;
