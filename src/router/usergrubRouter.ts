import Router from "express";
import usergrubController from "../controller/usergrubController";
import usegrubMiddleware from "../middleware/usergrubMiddleware";
import secureMiddleware from "../middleware/secureMiddleware";

const usergrubRouter = Router();
const controller = new usergrubController();

usergrubRouter.use(secureMiddleware.checkToken);
usergrubRouter.get(
  "/:uuid",
  usegrubMiddleware.validateUserInGrub,
  controller.get_usersInGrub
);
usergrubRouter.get(
  "/:uuid",
  usegrubMiddleware.validateUserInGrub,
  controller.get_userInGrub
);

usergrubRouter.post(
  "/:uuid",
  usegrubMiddleware.validateGrubOwnership,
  controller.add_userToGrub
);
usergrubRouter.put(
  "/:uuid",
  usegrubMiddleware.validateGrubOwnership,
  controller.update_userRoleInGrub
);
usergrubRouter.delete(
  "/:uuid",
  usegrubMiddleware.validateGrubOwnership,
  controller.remove_userFromGrub
);

export default usergrubRouter;
