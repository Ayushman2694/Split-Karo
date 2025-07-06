import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from './group.entity';

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.groupMemberships, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group: Group;

  @CreateDateColumn()
  joinedAt: Date;
}
