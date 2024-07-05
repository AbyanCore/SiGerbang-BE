import Router from "express";
import usergrubController from "../controller/usergrubController";

const usergrubRouter = Router();
const controller = new usergrubController();

usergrubRouter.get("/:uuid", controller.get_usersInGrub);
usergrubRouter.get("/:uuid", controller.get_userInGrub);
usergrubRouter.post("/:uuid", controller.add_userToGrub);
usergrubRouter.put("/:uuid", controller.update_userRoleInGrub);
usergrubRouter.delete("/:uuid", controller.remove_userFromGrub);

export default usergrubRouter;
