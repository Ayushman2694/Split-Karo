import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Settlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.settlementsSent)
  from: User;

  @ManyToOne(() => User, (user) => user.settlementsReceived)
  to: User;

  @Column('decimal')
  amount: number;

  @Column()
  groupId: string;

  @CreateDateColumn()
  settledAt: Date;
}
