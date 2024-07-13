import WebSocket from "ws";
import http from "http";
import betterlog from "../utils/betterlog";

export interface coreWebsocketInterface {
  name: string;
  handleUpgrade(request: http.IncomingMessage, socket: any, head: any): void;
  run(): WebSocket.Server;
  stop(): void;
}

class coreWebsocket {
  server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  > | null = null;

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.server = server;
  }

  addWebsocket(path: string, wss: coreWebsocketInterface): coreWebsocket {
    betterlog("core ws", `Add websocket ${wss.name} at ${path}`);
    this.server?.on("upgrade", (request, socket, head) => {
      if (request.url === path) {
        wss.handleUpgrade(request, socket, head);
      }
    });
    return this;
  }
}

export default coreWebsocket;
