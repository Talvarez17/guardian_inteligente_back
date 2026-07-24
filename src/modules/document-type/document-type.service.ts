import { DocumentalAreaService } from './../documental-area/documental-area.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentType } from './entities/document-type.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'category_id', 'validity', 'status'];

@Injectable()
export class DocumentTypeService {

  constructor(@InjectRepository(DocumentType) private readonly documentalTypeRepository: Repository<DocumentType>, private readonly documentalAreaService: DocumentalAreaService) { }

  async createType(createDocumentTypeDto: CreateDocumentTypeDto): Promise<DocumentType> {

    const exists = await this.documentalTypeRepository.findOne({
      where: { name: createDocumentTypeDto.name }
    })

    if (exists) {
      throw new ConflictException('Type already exists');
    }

    const category = await this.documentalAreaService.findOneArea(createDocumentTypeDto.category_id)

    const type = this.documentalTypeRepository.create({
      ...createDocumentTypeDto,
      category_id: category.id
    })

    return this.documentalTypeRepository.save(type)
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<DocumentType>> {
    const { page, limit, sortBy, order, search, onlyActive } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.documentalTypeRepository.createQueryBuilder('documentType');

    if (search) {
      qb.where('documentType.name ILIKE :search', { search: `%${search}%` });
    }

    if (onlyActive) {
      qb.andWhere('documentType.status = :status', { status: true });
    }

    qb.orderBy(`documentType.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneType(id: number): Promise<DocumentType> {
    const docType = await this.documentalTypeRepository.findOne({
      where: { id }
    })

    if (!docType) {
      throw new NotFoundException('Type not found');
    }

    return docType
  }

  async updateType(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto): Promise<DocumentType> {
    const type = await this.findOneType(id);

    Object.assign(type,updateDocumentTypeDto);

    return this.documentalTypeRepository.save(type);
  }

  async removeType(id: number): Promise<{message:string}> {
    const docType = await this.findOneType(id);

    docType.status = false;

    await this.documentalTypeRepository.save(docType);

    return {message: 'Type removed'};
  }
}
