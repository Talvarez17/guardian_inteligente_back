import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentalAreaService } from './documental-area.service';
import { DocumentalAreaController } from './documental-area.controller';
import { DocumentalArea } from './entities/documental-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentalArea])],
  controllers: [DocumentalAreaController],
  providers: [DocumentalAreaService],
  exports: [DocumentalAreaService],
})
export class DocumentalAreaModule {}
