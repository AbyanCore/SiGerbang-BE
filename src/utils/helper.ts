import { Response } from "express";
import ResponseMessage from "../model/ResponeMessage";

class helper {
  static sendResponse(
    res: Response,
    data: any,
    message: string = "sucess",
    status: number = 200
  ) {
    res
      .status(status)
      .json({
        data: data,
        message: message,
        status: status,
      } as ResponseMessage)
      .send();
  }

  static sendErrorResponse(
    res: Response,
    message: string = "error",
    status: number = 404
  ) {
    res
      .status(status)
      .json({
        data: null,
        message: message,
        status: status,
      } as ResponseMessage)
      .send();
  }
}

export default helper;
