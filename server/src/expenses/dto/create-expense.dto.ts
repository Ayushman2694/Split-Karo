/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description: string;
  @IsNumber()
  amount: number;
  @IsUUID()
  groupId: string;
  @IsUUID()
  paidBy: string;
}
