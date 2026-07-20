import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentContactService } from './establishment-contact.service';
import { EstablishmentContactController } from './establishment-contact.controller';
import { EstablishmentContact } from './entities/establishment-contact.entity';
import { EstablishmentModule } from '../establishment/establishment.module';
import { ClientRolesModule } from '../client-roles/client-roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([EstablishmentContact]), EstablishmentModule, ClientRolesModule],
  controllers: [EstablishmentContactController],
  providers: [EstablishmentContactService],
  exports: [EstablishmentContactService],
})
export class EstablishmentContactModule {}
