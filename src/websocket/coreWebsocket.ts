import WebSocket from "ws";
import http from "http";
import betterlog from "../utils/betterlog";
import net from "net";

type pathws = {
  path: string;
  wss: coreWebsocketInterface;
};

export type clientMessage = {
  topic: string;
  command: string;
  data?: any;
  from: string;
  to: string;
};

export interface coreWebsocketInterface {
  name: string;
  clients: Array<clientWebsocket>;

  handleUpgrade(request: http.IncomingMessage, socket: any, head: any): void;
  run(): WebSocket.Server;
  heartbeat(): void;
  stop(): void;
}

export interface clientWebsocket extends WebSocket {
  uuid: string;
  isVerified: boolean;
  isAlive: boolean;
}

class coreWebsocket {
  server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  > | null = null;
  pathws: Array<pathws> = [];

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.server = server;
  }

  addWebsocket(path: string, wss: coreWebsocketInterface): coreWebsocket {
    betterlog("core ws", `Add websocket ${wss.name} at ${path}`);
    this.pathws.push({
      path,
      wss,
    });

    this.server?.removeAllListeners("upgrade");
    this.server?.on("upgrade", (request, socket, head) => {
      this.pathws.forEach((pathws_item) => {
        if (request.url === pathws_item.path) {
          pathws_item.wss.handleUpgrade(request, socket, head);
        }
      });
    });
    return this;
  }
}

export default coreWebsocket;
