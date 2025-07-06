import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findById(userId: string) {
    return await this.userRepo.findOne({ where: { id: userId } });
  }

  async create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
  async getUserGroups(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'groupMemberships',
        'groupMemberships.group',
        'groupMemberships.group.members',
        'groupMemberships.group.members.user',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    // Deduplicate groups by ID
    const groupMap = new Map<string, any>();

    user.groupMemberships.forEach((membership) => {
      const group = membership.group;

      if (!groupMap.has(group.id)) {
        groupMap.set(group.id, {
          id: group.id,
          name: group.name,
          members: [],
        });
      }

      const groupData = groupMap.get(group.id);

      // Add members (deduplicate by user.id)
      const memberIds = new Set(groupData.members.map((m) => m.id));
      group.members.forEach((member) => {
        if (!memberIds.has(member.user.id)) {
          groupData.members.push({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
          });
          memberIds.add(member.user.id);
        }
      });
    });

    return Array.from(groupMap.values());
  }
  async findAllExcept(loggedInUserId: string) {
    return await this.userRepo.find({
      where: { id: Not(loggedInUserId) },
      select: ['id', 'name', 'email'],
    });
  }
}
