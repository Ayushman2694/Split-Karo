import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { ExpenseSplit } from './expense-split.entity';

export enum SplitType {
  EQUAL = 'equal',
  UNEQUAL = 'unequal',
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() description: string;
  @Column('decimal') amount: number;
  @Column({ type: 'enum', enum: SplitType, default: SplitType.EQUAL })
  splitType: SplitType;

  @ManyToOne(() => User, (u) => u.expensesPaid) paidBy: User;
  @ManyToOne(() => Group, (group) => group.expenses, { eager: true })
  group: Group;
  @OneToMany(() => ExpenseSplit, (s) => s.expense, { cascade: true })
  splits: ExpenseSplit[];
  @CreateDateColumn() createdAt: Date;
}
