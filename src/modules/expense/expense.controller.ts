import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly ExpenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: Prisma.ExpensesCreateInput) {
    return this.ExpenseService.create(createExpenseDto);
  }

  @Get()
  findAll(@Query() params) {
    return this.ExpenseService.getExpensesByUserId(params);
  }

  @Get(':expenseId')
  findOne(@Param('expenseId') expenseId: number) {
    return this.ExpenseService.findOne(expenseId);
  }

  @Patch(':expenseId')
  update(
    @Param('expenseId') expenseId: number,
    @Body() updateExpenseDto: Prisma.ExpensesUpdateInput,
  ) {
    return this.ExpenseService.update(expenseId, updateExpenseDto);
  }

  @Delete(':expenseId')
  remove(@Param('expenseId') expenseId: number) {
    return this.ExpenseService.remove(expenseId);
  }
}
