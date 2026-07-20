import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentOperationService } from './establishment-operation.service';
import { EstablishmentOperationController } from './establishment-operation.controller';
import { EstablishmentOperation } from './entities/establishment-operation.entity';
import { EstablishmentModule } from '../establishment/establishment.module';

@Module({
  imports: [TypeOrmModule.forFeature([EstablishmentOperation]), EstablishmentModule],
  controllers: [EstablishmentOperationController],
  providers: [EstablishmentOperationService],
  exports: [EstablishmentOperationService],
})
export class EstablishmentOperationModule {}
