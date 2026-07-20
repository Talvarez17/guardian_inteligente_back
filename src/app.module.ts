import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { ClientRolesModule } from './modules/client-roles/client-roles.module';
import { DocumentalAreaModule } from './modules/documental-area/documental-area.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { PlanFeatureModule } from './modules/plan-feature/plan-feature.module';
import { PlansModule } from './modules/plans/plans.module';
import { EstablishmentModule } from './modules/establishment/establishment.module';
import { TurnoverModule } from './modules/turnover/turnover.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SeedModule } from './modules/seed/seed.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { PaymentFormModule } from './modules/payment-form/payment-form.module';
import { ChecklistItemTypeModule } from './modules/checklist-item-type/checklist-item-type.module';
import { EstablishmentContactModule } from './modules/establishment-contact/establishment-contact.module';
import { EstablishmentOperationModule } from './modules/establishment-operation/establishment-operation.module';
import { EstablishmentBillingModule } from './modules/establishment-billing/establishment-billing.module';
import { EstablishmentChecklistItemModule } from './modules/establishment-checklist-item/establishment-checklist-item.module';
import { PaymentRecordModule } from './modules/payment-record/payment-record.module';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }),
      ThrottlerModule.forRoot([
        {
          ttl: 60000,
          limit: 100,
        },
      ]),
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
      ClientRolesModule,
      DocumentalAreaModule,
      DocumentTypeModule,
      PlanFeatureModule,
      PlansModule,
      EstablishmentModule,
      TurnoverModule,
      DocumentsModule,
      PaymentMethodModule,
      PaymentFormModule,
      ChecklistItemTypeModule,
      EstablishmentContactModule,
      EstablishmentOperationModule,
      EstablishmentBillingModule,
      EstablishmentChecklistItemModule,
      PaymentRecordModule,
      SeedModule,],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
