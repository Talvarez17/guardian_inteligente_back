import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeController } from './document-type.controller';
import { DocumentType } from './entities/document-type.entity';
import { DocumentalAreaModule } from '../documental-area/documental-area.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentType]), DocumentalAreaModule],
  controllers: [DocumentTypeController],
  providers: [DocumentTypeService],
})
export class DocumentTypeModule {}
