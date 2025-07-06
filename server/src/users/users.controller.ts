import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId/groups')
  getUserGroups(@Param('userId') userId: string) {
    return this.usersService.getUserGroups(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/groups')
  getMyGroups(@Req() req) {
    return this.usersService.getUserGroups(req.user.userId);
  }
}
