import Router from "express";
import authController from "../controller/authController";

const authRouter = Router();
const controller = new authController();

authRouter
  .post("/signin", controller.signin)
  .post("/signup", controller.signup);

export default authRouter;
