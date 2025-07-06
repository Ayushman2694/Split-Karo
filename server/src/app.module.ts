/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { GroupModule } from './groups/groups.module';
import { ExpenseModule } from './expenses/expenses.module';
import { SettlementModule } from './settlements/settlements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'test1234',
      database: 'splitkaro',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GroupModule,
    ExpenseModule,
    SettlementModule,
  ],
})
export class AppModule {}
