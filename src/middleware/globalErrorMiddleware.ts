import { NextFunction, Request, Response } from "express";
import customError from "../error/customError";

async function globalErrorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof customError) {
    res.status(err.errorCode).json({
      errorCode: err.errorCode,
      errorType: err.errorType,
      error: err.serializeErrors(),
    });
    return;
  }

  res.status(500).json({
    errorCode: 500,
    errorType: "InternalServerError",
    error: "Something went wrong",
  });
}

export default globalErrorMiddleware;
