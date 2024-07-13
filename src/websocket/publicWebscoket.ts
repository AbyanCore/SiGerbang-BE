import http from "http";
import WebSocket from "ws";
import { coreWebsocketInterface } from "./coreWebsocket";
import betterlog from "../utils/betterlog";

class publicWebsocket implements coreWebsocketInterface {
  wss: WebSocket.Server = new WebSocket.Server({ noServer: true });
  name: string = "public ws";

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.wss = new WebSocket.Server({ server });
    this.run();
  }

  handleUpgrade(request: http.IncomingMessage, socket: any, head: any): void {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit("connection", ws, request);
      betterlog("public ws", `New connection ${socket.remoteAddress}`);
    });
  }

  run(): WebSocket.Server {
    this.wss.addListener("connection", (ws) => {
      ws.on("open", () => {
        betterlog("public ws", "Open connection");
      });
      ws.on("close", () => {
        betterlog("public ws", "Close connection");
      });
      ws.on("message", (message: any) => {
        betterlog("public ws", `Received message: ${message}`);
        ws.send(`You sent -> ${message}`);
      });
      ws.send("Hello! Message From Server");
    });

    // create custom event listener
    this.wss.addListener("custom", (ws, data) => {
      ws.send(data);
    });

    return this.wss;
  }

  stop(): void {
    this.wss.close();
  }
}

export default publicWebsocket;
