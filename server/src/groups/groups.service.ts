import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private gmRepo: Repository<GroupMember>,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateGroupDto, creatorId: string) {
    const group = this.groupRepo.create({ name: dto.name });
    const saved = await this.groupRepo.save(group);
    await this.gmRepo.save({ user: { id: creatorId }, group: saved });
    return saved;
  }

  async addMember(groupId: string, dto: AddMemberDto) {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');
    const user = await this.usersService.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');
    return this.gmRepo.save({ user, group });
  }

  async findOne(groupId: string) {
    return this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user', 'expenses']
    });
  }
}
