import http from "http";
import WebSocket from "ws";
import {
  clientMessage,
  clientWebsocket,
  coreWebsocketInterface,
} from "./coreWebsocket";
import betterlog from "../utils/betterlog";

class privateWebsocket implements coreWebsocketInterface {
  wss: WebSocket.Server = new WebSocket.Server({ noServer: true });
  name: string = "private ws";
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
      this.clients.push(ws);
      ws.uuid = Math.random().toString(36).substring(7);
      ws.isVerified = false;
      ws.isAlive = true;

      ws.on("close", () => {
        betterlog(this.name, "Close Connection");
        this.clients.filter((pred) => pred.uuid !== ws.uuid);
        ws.terminate();
      });

      // handle pong
      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (message: string) => {
        let mess: clientMessage;
        try {
          mess = JSON.parse(message) as clientMessage;
        } catch (err: any) {
          betterlog(this.name, `Error: ${err.message}`);
          return;
        }

        if (!mess.from) {
          mess.from = ws.uuid;
        }

        message = JSON.stringify(mess);

        if (mess.to == "all") {
          this.clients.forEach((client) => {
            if (client.OPEN == WebSocket.OPEN && client.uuid != ws.uuid)
              client.send(message.toString());
          });
        } else if (mess.to == "server") {
          switch (mess.topic) {
            case "getListClient":
              ws.send(
                JSON.stringify({
                  topic: mess.command,
                  command: "getListClient",
                  from: "server",
                  data: this.clients.map((client) => {
                    return { uuid: client.uuid, isVerified: client.isVerified };
                  }),
                  to: mess.from,
                })
              );
              break;
            case "v4r1fy":
              ws.uuid = mess.data.device_id;
              betterlog(this.name, `Client ${ws.uuid} is verified`);
              break;
            default:
              break;
          }
        } else {
          this.clients.forEach((client) => {
            if (client.uuid == mess.to && client.OPEN == WebSocket.OPEN) {
              client.send(message.toString());
            }
          });
        }
      });

      ws.send(
        JSON.stringify({
          topic: "v4r1fy",
          command: "getDeviceInfo",
          from: "server",
        })
      );
    });

    return this.wss;
  }

  heartbeat(): void {
    setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
      });
    }, 10000);
  }

  stop(): void {
    this.wss.close();
  }
}

export default privateWebsocket;
