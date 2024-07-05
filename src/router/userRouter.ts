import { Response, Request, Router } from "express";
import userController from "../controller/userController";
import secureMiddleware from "../middleware/secureMiddleware";

const controller = new userController();
const userRouter = Router();

userRouter.use(secureMiddleware);
userRouter
  .get("/", controller.get_users)
  .get("/:id", controller.get_user)
  .post("/", controller.post_user)
  .put("/:id", controller.put_user)
  .delete("/:id", controller.delete_user);

export default userRouter;
