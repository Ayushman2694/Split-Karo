import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { GroupService } from './groups.service';
import { GroupController } from './groups.controller';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember]), UserModule],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
