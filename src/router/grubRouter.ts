import grubController from "../controller/grubController";
import { Router } from "express";
import secureMiddleware from "../middleware/secureMiddleware";

const grubRouter = Router();
const controller = new grubController();

grubRouter.use(secureMiddleware.checkToken);
grubRouter
  .get("/", controller.get_grubs)
  .get("/:uuid", controller.get_grub)
  .post("/", controller.post_grub)
  .put("/:uuid", controller.put_grub)
  .delete("/:uuid", controller.delete_grub);

export default grubRouter;
