import http from "http";
import WebSocket from "ws";
import { clientWebsocket, coreWebsocketInterface } from "./coreWebsocket";
import betterlog from "../utils/betterlog";

class publicWebsocket implements coreWebsocketInterface {
  wss: WebSocket.Server = new WebSocket.Server({ noServer: true });
  name: string = "public ws";
  clients: clientWebsocket[] = [];

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.wss = new WebSocket.Server({ server });
    this.run();
  }

  handleUpgrade(request: http.IncomingMessage, socket: any, head: any): void {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit("connection", ws, request);
      betterlog(this.name, `New connection ${socket.remoteAddress}`);
    });
  }

  run(): WebSocket.Server {
    this.wss.addListener("connection", (ws: clientWebsocket) => {
      // send command to getDeviceInfo
      ws.send(
        JSON.stringify({
          command: "getDeviceInfo",
          from: "server",
        })
      );

      ws.on("open", () => {
        betterlog(this.name, "Connection Open");
        this.clients.push(ws);
      });

      ws.on("close", () => {
        betterlog(this.name, "Close Connection");
        this.clients.filter((pred) => pred.uuid !== ws.uuid);
      });

      ws.on("message", (message: any) => {
        betterlog(this.name, `Received message: ${message}`);
      });
    });

    return this.wss;
  }

  heartbeat(): void {
    this.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }

  stop(): void {
    this.wss.close();
  }
}

export default publicWebsocket;
