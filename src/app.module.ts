import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { DocumentalAreaModule } from './modules/documental-area/documental-area.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { PlanFeatureModule } from './modules/plan-feature/plan-feature.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
      RolesModule,
      DocumentalAreaModule,
      DocumentTypeModule,
      PlanFeatureModule,
      PlansModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
