import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { NoteModule } from './modules/note/note.module';
import { UserModule } from './modules/user/user.module';
import { RequestId } from './infra/middleware/request-id.middleware';
import { LoggingMiddleware } from './infra/middleware/logging.middleware';
import * as cors from 'cors';
import * as httpContext from 'express-http-context';

@Module({
  imports: [AccountModule, AuthModule, ExpenseModule, NoteModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestId, LoggingMiddleware, httpContext.middleware, cors())
      .forRoutes('*');
  }
}
