import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body) {
    return this.authService.login(body);
  }
  @Post('/signup')
  signup(@Body() body) {
    return this.authService.signup(body);
  }
}
