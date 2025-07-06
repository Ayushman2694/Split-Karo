import { IsUUID, IsNumber } from 'class-validator';

export class CreateSettlementDto {
  @IsUUID() toUserId: string;
  @IsNumber() amount: number;
  @IsUUID() groupId: string;
}
