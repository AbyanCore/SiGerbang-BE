import grubController from "../controller/grubController";
import { Router } from "express";
import secureMiddleware from "../middleware/secureMiddleware";
import usegrubMiddleware from "../middleware/usergrubMiddleware";

const grubRouter = Router();
const controller = new grubController();

grubRouter.use(secureMiddleware.checkToken);
grubRouter
  .get("/", secureMiddleware.checkIsAdmin, controller.get_grubs)
  .get("/:uuid", usegrubMiddleware.validateUserInGrub, controller.get_grub)
  .post("/", controller.post_grub)
  .put("/:uuid", usegrubMiddleware.validateGrubOwnership, controller.put_grub)
  .delete(
    "/:uuid",
    usegrubMiddleware.validateGrubOwnership,
    controller.delete_grub
  );

export default grubRouter;
