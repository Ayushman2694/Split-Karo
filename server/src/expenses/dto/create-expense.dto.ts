/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID, IsString, IsNumber, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { SplitType } from '../expense.entity';

class SplitDto {
  @IsUUID()
  userId: string;
  @IsNumber()
  amount: number;
}

export class CreateExpenseDto {
  @IsString()
  description: string;
  @IsNumber()
  amount: number;
  @IsUUID()
  groupId: string;
  @IsString()
  splitType: SplitType;
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SplitDto)
  splits: SplitDto[];
}
