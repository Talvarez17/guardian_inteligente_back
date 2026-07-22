import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { DocumentalAreaService } from '../documental-area/documental-area.service';
import { EstablishmentService } from '../establishment/establishment.service';
import { StorageService } from '../../common/storage/storage.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'version', 'expiration_date', 'status'];
const STORAGE_FOLDER = 'documents';

@Injectable()
export class DocumentsService {

  constructor(
    @InjectRepository(Document) private readonly documentRepository: Repository<Document>,
    private readonly documentalAreaService: DocumentalAreaService,
    private readonly establishmentService: EstablishmentService,
    private readonly storageService: StorageService,
  ) { }

  async createDocument(createDocumentDto: CreateDocumentDto, file: Express.Multer.File): Promise<Document> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { establishment_id, area_id, ...documentData } = createDocumentDto;

    const establishment = await this.establishmentService.findOneEstablishment(establishment_id);

    const exists = await this.documentRepository.findOne({
      where: { name: createDocumentDto.name, establishment: { id: establishment_id } },
    })

    if (exists) {
      throw new ConflictException('Document already exists');
    }

    const area = await this.documentalAreaService.findOneArea(area_id);

    const url = await this.storageService.uploadFile(file, STORAGE_FOLDER);

    const document = this.documentRepository.create({
      ...documentData,
      establishment,
      area,
      url,
    })

    return this.documentRepository.save(document);
  }

  async findAllDocuments(query: PaginationQueryDto): Promise<PaginatedResponse<Document>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.area', 'area');

    if (search) {
      qb.where('document.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`document.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findAllByEstablishment(establishmentId: string, query: PaginationQueryDto): Promise<PaginatedResponse<Document>> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.area', 'area')
      .where('document.establishment_id = :establishmentId', { establishmentId });

    if (search) {
      qb.andWhere('document.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`document.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneDocument(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id }
    })

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async updateDocument(id: number, updateDocumentDto: UpdateDocumentDto, file?: Express.Multer.File): Promise<Document> {
    const document = await this.findOneDocument(id);

    const { area_id, establishment_id, ...updateData } = updateDocumentDto;

    Object.assign(document, updateData);

    if (area_id) {
      document.area = await this.documentalAreaService.findOneArea(area_id);
    }

    if (establishment_id) {
      document.establishment = await this.establishmentService.findOneEstablishment(establishment_id);
    }

    if (file) {
      document.url = await this.storageService.uploadFile(file, STORAGE_FOLDER);
    }

    return this.documentRepository.save(document);
  }

  async deleteDocument(id: number): Promise<{ message: string }> {
    const document = await this.findOneDocument(id);

    document.status = false;

    await this.documentRepository.save(document);

    return { message: 'Document removed' };
  }

  async deleteDocumentPermanently(id: number): Promise<{ message: string }> {
    const document = await this.findOneDocument(id);

    await this.storageService.deleteFile(document.url);

    await this.documentRepository.remove(document);

    return { message: 'Document permanently removed' };
  }
}
