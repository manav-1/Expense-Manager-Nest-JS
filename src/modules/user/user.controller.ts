import { Controller, Get, Body, Patch } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getUserProfile() {
    return this.userService.getUserProfile();
  }

  @Patch('/profile')
  updateUserProfile(@Body() updateUserData: Prisma.AccountUpdateInput) {
    return this.userService.updateUserProfile(updateUserData);
  }
}
