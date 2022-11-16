import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService],
  imports: [PrismaModule, HelperModule],
})
export class ExpenseModule {}
