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
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get()
  findOne(@Query('limit') limit: number, @Query('page') page: number) {
    return this.accountService.getAccountByUserId({ limit, page });
  }
  @Post()
  create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountService.createAccount(createAccountDto);
  }

  // @Get()
  // findAll(@Query() params: Prisma.AccountFindManyArgs) {
  //   return this.accountService.findAll(params);
  // }

  @Patch(':accountId')
  update(
    @Param('accountId') accountId: number,
    @Body() updateAccountDto: Prisma.AccountUpdateInput,
  ) {
    return this.accountService.update(accountId, updateAccountDto);
  }

  @Delete(':accountId')
  remove(@Param('accountId') accountId: number) {
    return this.accountService.delete(accountId);
  }
}
