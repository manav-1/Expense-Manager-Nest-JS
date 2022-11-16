import * as httpContext from 'express-http-context';
import jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiPath = req.baseUrl;
    const unauthorisedErrorReq = (e: string) => new Error(JSON.stringify(e));

    if (apiPath.startsWith('/api/')) {
      let decodedToken;
      const secretKey = String(process.env.SECRET_KEY);
      try {
        decodedToken = jwt.verify(
          req.headers.authorization.split(' ')[1],
          secretKey,
        );
        httpContext.set('token', decodedToken);
      } catch (e) {
        next(unauthorisedErrorReq(`Invalid token`));
        return;
      }
    }
    httpContext.set('Value', 1);
    next();
  }
}
