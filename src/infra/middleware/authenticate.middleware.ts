import * as httpContext from 'express-http-context';
import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiPath = req.baseUrl;
    const unauthorisedErrorReq = (e: string) => new Error(JSON.stringify(e));

    if (apiPath.includes('socket')) return;

    if (!apiPath.includes('login') && !apiPath.includes('signup')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const secretKey = process.env.SECRET_KEY;
        const decodedToken = jwt.verify(token, secretKey);
        httpContext.set('token', decodedToken);
      } catch (e) {
        next(unauthorisedErrorReq(`Invalid token`));
        return;
      }
    }
    // httpContext.set('Value', 1);
    next();
  }
}
