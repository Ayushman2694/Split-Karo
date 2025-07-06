import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UsersService } from '../users/users.service';
import { Settlement } from 'src/settlements/settlement.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private gmRepo: Repository<GroupMember>,
    @InjectRepository(Settlement) private settlementRepo: Repository<Settlement>,
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
      relations: ['members', 'members.user', 'expenses'],
    });
  }

  async calculateBalances(groupId: string) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['expenses', 'expenses.paidBy', 'expenses.splits', 'expenses.splits.user'],
    });

    if (!group) throw new NotFoundException('Group not found');

    const settlements = await this.settlementRepo.find({
      where: { groupId },
      relations: ['from', 'to'],
    });

    const balances: Record<string, { name: string; balance: number }> = {};

    // 1. Process all expenses
    for (const expense of group.expenses) {
      const payer = expense.paidBy;
      const payerId = payer.id;

      if (!balances[payerId]) {
        balances[payerId] = { name: payer.name, balance: 0 };
      }
      balances[payerId].balance += Number(expense.amount);

      for (const split of expense.splits) {
        const user = split.user;
        const userId = user.id;

        if (!balances[userId]) {
          balances[userId] = { name: user.name, balance: 0 };
        }
        balances[userId].balance -= Number(split.amount);
      }
    }

    // 2. Apply settlements (reduce balances)
    for (const s of settlements) {
      const fromId = s.from.id;
      const toId = s.to.id;
      const amt = Number(s.amount);

      if (!balances[fromId]) {
        balances[fromId] = { name: s.from.name, balance: 0 };
      }
      if (!balances[toId]) {
        balances[toId] = { name: s.to.name, balance: 0 };
      }

      balances[fromId].balance += amt;
      balances[toId].balance -= amt;
    }
    const response = Object.entries(balances).map(([userId, data]) => ({
      userId,
      name: data.name,
      balance: data.balance,
    }));
    return response;
  }
}
