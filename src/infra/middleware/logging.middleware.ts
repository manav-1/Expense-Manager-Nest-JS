import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cleanup = () => {
      res.removeListener('close', abortFn);
      res.removeListener('error', errorFn);
    };
    const getRequestData = (req: Request) => {
      switch (req.method) {
        case 'GET':
        case 'DELETE':
          return {
            query: req.query,
            headers: req.headers,
            url: req.originalUrl,
          };
        case 'POST':
        case 'PUT':
        case 'PATCH':
          return {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
            url: req.originalUrl,
          };
      }
    };
    const getResponseData = (res: Response) => {
      const rawResponse = res.write;
      const rawResponseEnd = res.end;
      const chunkBuffers = [];
      res.write = (...chunks) => {
        const resArgs = [];
        for (let i = 0; i < chunks.length; i++) {
          resArgs[i] = chunks[i];
          if (!resArgs[i]) {
            res.once('drain', res.write);
            i--;
          }
        }
        if (resArgs[0]) {
          chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        return rawResponse.apply(res, resArgs);
      };
      res.end = (...chunk) => {
        const resArgs = [];
        for (let i = 0; i < chunk.length; i++) {
          resArgs[i] = chunk[i];
        }
        if (resArgs[0]) {
          chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        const body = Buffer.concat(chunkBuffers).toString('utf8');
        const responseLog = {
          response: {
            statusCode: res.statusCode,
            body: body,
            // Returns a shallow copy of the current outgoing headers
            headers: res.getHeaders(),
          },
        };
        // console.log(getRequestData(req));
        // console.log('res: ', responseLog);
        rawResponseEnd.apply(res, resArgs);
        return responseLog as unknown as Response;
      };
    };

    const abortFn = () => {
      cleanup();
      console.warn(
        `Request aborted by the client for request ${req.headers['X-Request-Id']}`,
      );
    };

    const errorFn = (err) => {
      cleanup();
      console.error(
        `Request pipeline error: ${err} for request ${req.headers['X-Request-Id']}`,
      );
    };

    getResponseData(res);
    res.on('finish', () => {
      cleanup();
    });
    res.on('close', abortFn); // aborted pipeline
    res.on('error', errorFn); // pipeline internal error
    next();
  }
}
