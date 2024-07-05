import Router from "express";
import systemController from "../controller/systemController";

const systemRouter = Router();
const controller = new systemController();

// systemRouter.get("/", controller.index);
systemRouter.get("/time", controller.get_time);
systemRouter.get("/random", controller.get_random);

export default systemRouter;
