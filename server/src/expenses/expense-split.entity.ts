// expense-split.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Expense } from './expense.entity';

@Entity()
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.splits)
  user: User;

  @ManyToOne(() => Expense, (expense) => expense.splits)
  expense: Expense;

  @Column('decimal')
  amount: number;
}
