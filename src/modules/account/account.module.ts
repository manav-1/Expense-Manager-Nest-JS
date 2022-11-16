import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [PrismaModule, HelperModule],
})
export class AccountModule {}
