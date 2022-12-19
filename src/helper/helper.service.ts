import * as jwt from 'jsonwebtoken';
import * as httpContext from 'express-http-context';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Helper {
  createJWTSignedToken(data, key, algorithm = null) {
    return algorithm ? jwt.sign(data, key, { algorithm }) : jwt.sign(data, key);
  }
  getToken() {
    return httpContext.get('token');
  }
}
