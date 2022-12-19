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
        date: new Date(body.date),
        accountId: Number(body.accountId),
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
      where: { accountId: Number(accountId) },
      data: {
        [updateType.toLowerCase()]: { [updateMethod]: value },
      },
    });
  }

  getExpensesByUserId = async (params) => {
    try {
      console.log(params);
      const {
        accounts: accountNames,
        types,
        ways,
        dateSet,
        endDate,
        startDate,
        take,
      } = params;
      const { userId } = this.helper.getToken();

      let expenseClause: Prisma.ExpensesWhereInput = {
        account: {
          userId: Number(userId),
        },
      };
      if (accountNames) {
        expenseClause = {
          ...expenseClause,
          account: {
            AND: {
              ...expenseClause.account,
              accountLabel: {
                in: accountNames,
              },
            },
          },
        };
      }
      if (types) {
        expenseClause = {
          ...expenseClause,
          expenseType: {
            in: types,
          },
        };
      }
      if (ways) {
        expenseClause = {
          ...expenseClause,
          expenseWay: {
            in: ways,
          },
        };
      }
      if (dateSet && JSON.parse(dateSet)) {
        expenseClause = {
          ...expenseClause,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        };
      }
      let expenses = await this.prisma.expenses.findMany({
        where: expenseClause,
        include: { account: true },
        take: parseInt(take, 10) || undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(expenses);
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
              data: { ...body, accountId: Number(body.accountId) },
            }),
            (_, value) =>
              typeof value === 'bigint' ? value.toString() : value,
          ),
        );

        await this.updateAccount(
          String(body.expenseType),
          'increment',
          Number(body.value),
          Number(body.accountId),
        );
        return data;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(expenseId: number) {
    const expense = await this.prisma.expenses.findUnique({
      where: { expenseId: BigInt(expenseId) },
    });
    await this.updateAccount(
      String(expense.expenseType),
      'decrement',
      Number(expense.value),
      expense.accountId,
    );
    await this.prisma.expenses.delete({
      where: { expenseId: Number(expenseId) },
    });
    return { message: 'Deleted Successfully' };
  }
}
