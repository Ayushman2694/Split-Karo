import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settlement } from './settlement.entity';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UsersService } from '../users/users.service';
// import { Group } from '../groups/group.entity';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(Settlement) private repo: Repository<Settlement>,
    private usersSvc: UsersService,
  ) {}

  async create(dto: CreateSettlementDto, fromId: string) {
    const toUser = await this.usersSvc.findById(dto.toUserId);
    if (!toUser) throw new NotFoundException('User not found');

    return this.repo.save({
      from: { id: fromId } as any,
      to: toUser,
      amount: dto.amount,
      groupId: dto.groupId,
    });
  }

  async findByGroup(groupId: string) {
    return this.repo.find({
      where: { groupId },
      relations: ['from', 'to'],
    });
  }
}
