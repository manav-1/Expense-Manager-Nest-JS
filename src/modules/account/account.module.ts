import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';
import { AuthMiddleware } from '../../infra/middleware/authenticate.middleware';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [PrismaModule, HelperModule],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
