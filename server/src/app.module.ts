import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './groups/groups.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SettlementsModule } from './settlements/settlements.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    UserModule,
    AuthModule,
    GroupModule,
    ExpensesModule,
    SettlementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
