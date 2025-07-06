import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../users/user.entity';

@Entity()
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Expense, (e) => e.splits, { onDelete: 'CASCADE' })
  expense: Expense;
  @ManyToOne(() => User, (u) => u.splits, { onDelete: 'CASCADE' })
  user: User;

  @Column('decimal') amountOwed: number;
}
