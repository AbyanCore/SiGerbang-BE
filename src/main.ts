import express, { Response } from "express";
import http from "http";
import WebSocket from "ws";
import { config } from "dotenv";

import loggerMiddleware from "./middleware/loggerMiddleware";
// import limiterMiddleware from "./middleware/limiterMiddleware";

import systemRouter from "./router/systemRouter";
import userRouter from "./router/userRouter";
import grubRouter from "./router/grubRouter";
import authRouter from "./router/authRouter";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());

// app.use(limiterMiddleware);
app.use(loggerMiddleware);

// Routing Grub
try {
  app.use("/system", systemRouter);
  app.use("/user", userRouter);
  app.use("/grub", grubRouter);
  app.use("/auth", authRouter);
} catch (e: any) {
  console.error(e);
}

// ws
// const wss = new WebSocket.Server({ server });

// Start server
server.listen(port, () => {
  console.log(`Express run at http://localhost:${port}`);
});
