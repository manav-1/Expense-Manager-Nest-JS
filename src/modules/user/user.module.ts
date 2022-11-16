import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, HelperModule],
})
export class UserModule {}
