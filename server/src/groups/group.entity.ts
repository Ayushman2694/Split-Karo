import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Expense } from '../expenses/expense.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => GroupMember, (gm) => gm.group)
  members: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];
}
