/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Param, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@UseGuards(JwtAuthGuard)
@Controller('settlements')
export class SettlementController {
  constructor(private svc: SettlementService) {}

  @Post()
  create(@Body() dto: CreateSettlementDto, @Req() req) {
    return this.svc.create(dto, req.user.userId);
  }

  @Get('group/:id')
  findByGroup(@Param('id') id: string) {
    return this.svc.findByGroup(id);
  }
}
