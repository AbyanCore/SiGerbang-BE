import express, { Response } from "express";
import http from "http";
import WebSocket from "ws";

import loggerMiddleware from "./middleware/loggerMiddleware";
// import limiterMiddleware from "./middleware/limiterMiddleware";

import systemRouter from "./router/systemRouter";
import userRouter from "./router/userRouter";
import grubRouter from "./router/grubRouter";
import authRouter from "./router/authRouter";
import usergrubRouter from "./router/usergrubRouter";
import coreWebsocket from "./websocket/coreWebsocket";
import publicWebsocket from "./websocket/publicWebscoket";
import globalErrorMiddleware from "./middleware/globalErrorMiddleware";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.json());

// app.use(limiterMiddleware);
app.use(loggerMiddleware);

// Routing Grub
app.use("/system", systemRouter);
app.use("/user", userRouter);
app.use("/grub", grubRouter);
app.use("/auth", authRouter);
app.use("/grub/action", usergrubRouter);

app.use(globalErrorMiddleware);

// ws
const wss = new coreWebsocket(server);
wss.addWebsocket("/public", new publicWebsocket(server));

// Start server
server.listen(port, () => {
  console.log(`Express run at http://localhost:${port}`);
});
