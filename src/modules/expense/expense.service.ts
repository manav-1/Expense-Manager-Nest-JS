import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Helper } from 'src/helper/helper.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService, private helper: Helper) {}

  async create(body: Prisma.ExpensesUncheckedCreateInput) {
    try {
      const expense: Prisma.ExpensesUncheckedCreateInput = {
        ...body,
      };
      const data = JSON.parse(
        JSON.stringify(
          await this.prisma.expenses.create({ data: expense }),
          (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        ),
      );
      await this.updateAccount(
        body.expenseType,
        'increment',
        body.value,
        body.accountId,
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateAccount(
    updateType: string,
    updateMethod: string,
    value: number,
    accountId,
  ) {
    await this.prisma.account.update({
      where: { accountId },
      data: {
        [updateType]: { [updateMethod]: value },
      },
    });
  }

  getExpensesByUserId = async ({
    limit = 10,
    page = 1,
    type,
    way,
  }: {
    limit: number;
    page: number;
    type: string;
    way: string;
  }) => {
    try {
      const userId = this.helper.getToken();
      const accounts = await (
        await this.prisma.account.findMany({
          where: { userId: Number(userId) },
        })
      ).map((item) => Number(item.accountId));
      const expenseClause: Prisma.ExpensesWhereInput = {
        accountId: { in: accounts },
      };
      const offset = (page - 1) * limit;
      if (type) {
        expenseClause.expenseType = type;
      }
      if (way) {
        expenseClause.expenseWay = way;
      }
      let expenses = await this.prisma.expenses.findMany({
        where: expenseClause,
        skip: offset,
        take: limit,
      });
      expenses = JSON.parse(
        JSON.stringify(expenses, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );
      return {
        expenses,
        length: expenses.length,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  findOne(expenseId) {
    return this.prisma.expenses.findUnique({ where: { expenseId } });
  }

  async update(expenseId: number, body: Prisma.ExpensesUncheckedUpdateInput) {
    try {
      const updateClause = {
        expenseId: BigInt(expenseId),
      };

      const expense = await this.prisma.expenses.findUnique({
        where: { expenseId: BigInt(expenseId) },
      });
      console.log(expense);
      if (expense) {
        await this.updateAccount(
          String(expense.expenseType),
          'decrement',
          Number(expense.value),
          expense.accountId,
        );
        delete body.expenseId;
        const data = JSON.parse(
          JSON.stringify(
            await this.prisma.expenses.update({
              where: updateClause,
              data: body,
            }),
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
          ),
        );

        await this.updateAccount(
          String(body.expenseType),
          'increment',
          Number(body.value),
          body.accountId,
        );
        return data;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(expenseId: number) {
    await this.prisma.expenses.delete({ where: { expenseId } });
    return { message: 'Deleted Successfully' };
  }
}
