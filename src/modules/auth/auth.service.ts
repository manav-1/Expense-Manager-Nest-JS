import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { Helper } from '../../helper/helper.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private helper: Helper) {}
  async login(body) {
    const response = {
      code: 400,
      message: '',
    };
    const { userEmail, userPassword } = body;
    const userClause = { userEmail };
    const user = JSON.parse(
      JSON.stringify(
        await this.prisma.user.findUnique({ where: userClause }),
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
    if (!user) {
      response.code = 401;
      response.message = 'User not found';
      throw response;
    }
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword,
    );
    if (!isPasswordValid) {
      response.code = 401;
      response.message = 'Password is invalid';
      throw response;
    }
    delete user.userPassword;
    const token = this.helper.createJWTSignedToken(
      user,
      process.env.SECRET_KEY,
    );

    return {
      token,
    };
  }

  async signup(body): Promise<{ token: string }> {
    const response = {
      message: {},
      code: 200,
    };
    const { userEmail, userPassword } = body;
    const existingUserClause = { userEmail };
    console.log(userEmail, existingUserClause);
    const existingUser = await this.prisma.user.findUnique({
      where: existingUserClause,
    });
    if (existingUser) {
      response.message = 'User already exists';
      response.code = 403;
      throw response;
    }
    body.userPassword = await bcrypt.hash(userPassword, 10);
    const user = JSON.parse(
      JSON.stringify(
        await this.prisma.user.create({
          data: body,
        }),
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
      ),
    );
    delete user.userPassword;

    await this.prisma.account.create({
      data: {
        accountLabel: 'Default',
        userId: BigInt(user.userId),
      },
    });

    const token: string = this.helper.createJWTSignedToken(
      user,
      process.env.SECRET_KEY,
    );
    return { token };
  }
}
