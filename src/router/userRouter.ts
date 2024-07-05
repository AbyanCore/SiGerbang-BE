import { Response, Request, Router } from "express";
import userController from "../controller/userController";

const controller = new userController();
const userRouter = Router();

userRouter.get("/", controller.get_users);
userRouter.get("/:id", controller.get_user);
userRouter.post("/", controller.post_user);
userRouter.put("/:id", controller.put_user);
userRouter.delete("/:id", controller.delete_user);

export default userRouter;
