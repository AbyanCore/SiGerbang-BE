import { Request, Response, NextFunction } from "express";

type clientModel = {
  address: String | undefined;
  method: String;
  url: String;
  createdAt: Date;
};

let clients: clientModel[] = [];

const limiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const client: clientModel = {
    address: req.ip?.toString(),
    method: req.method,
    url: req.url,
    createdAt: new Date(),
  };

  clients.push(client);

  const lastMinute = new Date(new Date().getTime() - 5000);
  clients = clients.filter((client) => client.createdAt > lastMinute);

  console.log(`Request count: ${clients.length} from ${client.address}`);

  if (
    clients.filter((client) => client.address == req.ip?.toString()).length > 10
  ) {
    res.sendStatus(429);
  } else {
    next();
  }
};

export default limiterMiddleware;
