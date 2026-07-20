import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRolesService } from './client-roles.service';
import { ClientRolesController } from './client-roles.controller';
import { ClientRole } from './entities/client-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRole])],
  controllers: [ClientRolesController],
  providers: [ClientRolesService],
  exports: [ClientRolesService],
})
export class ClientRolesModule {}
