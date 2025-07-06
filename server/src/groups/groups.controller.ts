/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { GroupService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private svc: GroupService) {}

  @Post()
  create(@Body() dto: CreateGroupDto, @Req() req) {
    return this.svc.create(dto, req.user.userId);
  }

  @Post(':id/add-member')
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.svc.addMember(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
