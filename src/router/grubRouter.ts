import grubController from "../controller/grubController";
import { Router } from "express";

const grubRouter = Router();
const controller = new grubController();

grubRouter.get("/", controller.get_grubs);
grubRouter.get("/:id", controller.get_grub);
grubRouter.post("/", controller.post_grub);
grubRouter.put("/:id", controller.put_grub);
grubRouter.delete("/:id", controller.delete_grub);

export default grubRouter;
