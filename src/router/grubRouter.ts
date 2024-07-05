import grubController from "../controller/grubController";
import { Router } from "express";
import secureMiddleware from "../middleware/secureMiddleware";

const grubRouter = Router();
const controller = new grubController();

grubRouter.use(secureMiddleware);
grubRouter
  .get("/", controller.get_grubs)
  .get("/:id", controller.get_grub)
  .post("/", controller.post_grub)
  .put("/:id", controller.put_grub)
  .delete("/:id", controller.delete_grub);

export default grubRouter;
