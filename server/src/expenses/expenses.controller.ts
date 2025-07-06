/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private svc: ExpenseService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto, @Req() req) {
    return this.svc.create(dto, req.user.userId);
  }

  @Get('group/:id')
  findByGroup(@Param('id') id: string) {
    return this.svc.findByGroup(id);
  }
}
