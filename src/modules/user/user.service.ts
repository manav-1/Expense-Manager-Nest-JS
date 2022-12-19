import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Helper } from 'src/helper/helper.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private helper: Helper) {}

  async getUserProfile() {
    const { userId } = this.helper.getToken();
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          userId: Number(userId),
        },
      });
      delete user.userPassword;
      return JSON.parse(
        JSON.stringify(user, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updateUserProfile(body) {
    const { userId } = this.helper.getToken();
    const userClause = { userId: Number(userId) };
    const user = await this.prisma.user.update({
      where: userClause,
      data: body,
    });
    return JSON.parse(
      JSON.stringify(user, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );
  }
}
