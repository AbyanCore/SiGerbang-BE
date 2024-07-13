import { Response, Request, Router } from "express";
import userController from "../controller/userController";
import secureMiddleware from "../middleware/secureMiddleware";
import userMiddleware from "../middleware/userMiddleware";

const controller = new userController();
const userRouter = Router();

userRouter.use(secureMiddleware.checkToken);
userRouter
  .get("/", secureMiddleware.checkIsAdmin, controller.get_users)
  .get("/:id", userMiddleware.checkIsOwner, controller.get_user)
  .post("/", secureMiddleware.checkIsAdmin, controller.post_user)
  .put("/:id", userMiddleware.checkIsOwner, controller.put_user)
  .delete("/:id", userMiddleware.checkIsOwner, controller.delete_user);

export default userRouter;
