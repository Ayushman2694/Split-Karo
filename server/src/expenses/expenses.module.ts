import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseSplit } from './expense-split.entity';
import { ExpenseService } from './expenses.service';
import { ExpenseController } from './expenses.controller';
import { UserModule } from '../users/users.module';
import { Group } from 'src/groups/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseSplit, Group]), UserModule],

  providers: [ExpenseService],
  controllers: [ExpenseController],
})
export class ExpenseModule {}
