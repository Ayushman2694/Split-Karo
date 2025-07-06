import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { GroupMember } from '../groups/group-member.entity';
import { Expense } from '../expenses/expense.entity';
import { ExpenseSplit } from '../expenses/expense-split.entity';
import { Settlement } from '../settlements/settlement.entity';
import { Group } from 'src/groups/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  @OneToMany(() => GroupMember, (gm) => gm.user)
  groupMemberships: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  expensesPaid: Expense[];

  @OneToMany(() => ExpenseSplit, (split) => split.user)
  splits: ExpenseSplit[];

  @OneToMany(() => Settlement, (settlement) => settlement.from)
  settlementsSent: Settlement[];

  @OneToMany(() => Settlement, (settlement) => settlement.to)
  settlementsReceived: Settlement[];
}
