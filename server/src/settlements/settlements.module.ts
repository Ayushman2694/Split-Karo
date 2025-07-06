import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settlement } from './settlement.entity';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlements.controller';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Settlement]), UserModule],
  providers: [SettlementService],
  controllers: [SettlementController],
})
export class SettlementModule {}
