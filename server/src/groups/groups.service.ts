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

    const balances: Record<string, number> = {};

    // 1. Process all expenses
    for (const expense of group.expenses) {
      const payerId = expense.paidBy.id;
      balances[payerId] = (balances[payerId] || 0) + Number(expense.amount);

      for (const split of expense.splits) {
        const userId = split.user.id;
        balances[userId] = (balances[userId] || 0) - Number(split.amountOwed);
      }
    }

    // 2. Apply settlements (reduce balances)
    for (const s of settlements) {
      const from = s.from.id;
      const to = s.to.id;
      const amt = Number(s.amount);

      balances[from] -= amt;
      balances[to] += amt;
    }

    return balances;
  }
}
