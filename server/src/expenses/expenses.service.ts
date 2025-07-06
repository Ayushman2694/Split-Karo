/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpenseSplit } from './expense-split.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Group } from '../groups/group.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expRepo: Repository<Expense>,

    @InjectRepository(ExpenseSplit)
    private splitRepo: Repository<ExpenseSplit>,

    @InjectRepository(Group)
    private groupRepo: Repository<Group>,

    private usersSvc: UsersService,
  ) {}

  async create(dto: CreateExpenseDto, payerId: string) {
    const group = await this.groupRepo.findOne({ where: { id: dto.groupId } });
    if (!group) throw new NotFoundException('Group not found');

    const expense = this.expRepo.create({
      description: dto.description,
      amount: dto.amount,
      splitType: dto.splitType,
      paidBy: { id: payerId } as any,
      group,
      splits: dto.splits.map((s) => ({
        user: { id: s.userId } as any,
        amountOwed: s.amount,
      })),
    });

    return this.expRepo.save(expense);
  }

  async findByGroup(groupId: string) {
    return this.expRepo.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.user'],
    });
  }
}
