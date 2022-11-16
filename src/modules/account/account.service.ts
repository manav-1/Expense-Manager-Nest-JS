import { Injectable } from '@nestjs/common';
import { Prisma, Account } from '@prisma/client';
import { Helper } from 'src/helper/helper.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService, private helper: Helper) {}
  async getAccountByUserId({
    limit = 10,
    page = 1,
  }: {
    limit: number;
    page: number;
  }): Promise<{ accounts: Account[]; length: number }> {
    const accountClause: {
      userId: number;
    } = { userId: this.helper.getToken() };
    const offset = (page - 1) * limit;
    let accounts = await this.prisma.account.findMany({
      where: accountClause,
      skip: offset,
      take: limit,
    });
    accounts = JSON.parse(
      JSON.stringify(accounts, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
    return {
      accounts,
      length: accounts.length,
    };
  }
  async createAccount(body: Prisma.AccountCreateInput): Promise<Account> {
    const userId = this.helper.getToken();
    const account: Prisma.AccountUncheckedCreateInput = {
      userId: Number(userId),
      ...body,
    };
    const data = JSON.parse(
      JSON.stringify(
        await this.prisma.account.create({ data: account }),
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
    return data;
  }

  findAll = (params: Prisma.AccountFindManyArgs) => {
    return this.prisma.account.findMany({ ...params });
  };

  async update(accountId: number, body: Prisma.AccountUncheckedUpdateInput) {
    const updateClause = {
      accountId: BigInt(accountId),
    };
    delete body.userId;
    delete body.accountId;
    return JSON.parse(
      JSON.stringify(
        await this.prisma.account.update({
          where: updateClause,
          data: body,
        }),
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
  }

  async delete(accountId: number) {
    await this.prisma.account.delete({ where: { accountId } });
    return { message: 'Deleted Successfully' };
  }
}
