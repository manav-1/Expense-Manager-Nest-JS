import { Controller, Post, Body } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() body) {
    return this.authService.login(body);
  }
  @Post()
  signup(@Body() body) {
    return this.authService.signup(body);
  }
}
