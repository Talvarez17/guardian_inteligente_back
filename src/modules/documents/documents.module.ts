import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { DocumentalAreaModule } from '../documental-area/documental-area.module';
import { StorageModule } from '../../common/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), DocumentalAreaModule, StorageModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
