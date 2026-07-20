import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { ChecklistItemType } from '../checklist-item-type/entities/checklist-item-type.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, ChecklistItemType])],
  providers: [SeedService],
})
export class SeedModule { }
