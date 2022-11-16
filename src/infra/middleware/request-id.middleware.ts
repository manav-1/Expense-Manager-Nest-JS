import { v4 as uuidv4 } from 'uuid';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestId implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const reqId = uuidv4();
    res.setHeader('X-Request-Id', reqId);
    req.headers = { ...req.headers, 'X-Request-Id': reqId };
    next();
  }
}
