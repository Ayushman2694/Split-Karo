/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { ExpenseSplit } from './expense-split.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Group } from '../groups/group.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

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

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const { description, amount, groupId } = createExpenseDto;

    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['members', 'members.user'],
    });

    if (!group) throw new NotFoundException('Group not found');

    const memberUsers = group.members.map((m) => m.user);
    const equalShare = Number((amount / memberUsers.length).toFixed(2));

    const expense = this.expRepo.create({
      description,
      amount,
      paidBy: { id: userId } as User,
      group: { id: groupId } as Group,
    });
    await this.expRepo.save(expense);

    const splits: ExpenseSplit[] = memberUsers.map((user) =>
      this.splitRepo.create({
        expense: { id: expense.id } as Expense,
        user: { id: user.id, name: user.name } as User,
        amount: equalShare,
      }),
    );

    await this.splitRepo.save(splits);

    return {
      message: 'Expense created and split equally',
      expense: {
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        paidBy: {
          id: userId,
          name: memberUsers.find((u) => u.id === userId)?.name || 'You',
        },
        group: {
          id: group.id,
          name: group.name,
        },
      },
      splits: splits.map((split) => ({
        id: split.id,
        amount: split.amount,
        user: {
          id: split.user.id,
          name: split.user.name,
        },
      })),
    };
  }

  async findByGroup(groupId: string) {
    return this.expRepo.find({
      where: { group: { id: groupId } },
      relations: ['paidBy', 'splits', 'splits.user'],
    });
  }
}
