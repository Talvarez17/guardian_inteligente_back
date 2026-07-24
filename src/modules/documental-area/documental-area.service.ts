import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentalAreaDto } from './dto/create-documental-area.dto';
import { UpdateDocumentalAreaDto } from './dto/update-documental-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentalArea } from './entities/documental-area.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['area', 'description', 'color', 'status'];

@Injectable()
export class DocumentalAreaService {

  constructor(
    @InjectRepository(DocumentalArea) private readonly documentalAreaRepository: Repository<DocumentalArea>
  ) { }

  async createArea(createDocumentalAreaDto: CreateDocumentalAreaDto): Promise<DocumentalArea> {
    const exists = await this.documentalAreaRepository.findOne({ where: { area: createDocumentalAreaDto.area } })

    if (exists) {
      throw new ConflictException('Area already exists');
    }

    const area = this.documentalAreaRepository.create(createDocumentalAreaDto);

    return this.documentalAreaRepository.save(area);
  }

  async findAllAreas(query: PaginationQueryDto): Promise<PaginatedResponse<DocumentalArea>> {
    const { page, limit, sortBy, order, search, onlyActive } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'area';

    const qb = this.documentalAreaRepository.createQueryBuilder('documentalArea');

    if (search) {
      qb.where(
        'documentalArea.area ILIKE :search OR documentalArea.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (onlyActive) {
      qb.andWhere('documentalArea.status = :status', { status: true });
    }

    qb.orderBy(`documentalArea.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneArea(id: number): Promise<DocumentalArea> {
    const area = await this.documentalAreaRepository.findOne({
      where: { id }
    })

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return area;
  }

  async updateArea(id: number, updateDocumentalAreaDto: UpdateDocumentalAreaDto): Promise<DocumentalArea> {
    const area = await this.findOneArea(id);

    Object.assign(area, updateDocumentalAreaDto)

    return this.documentalAreaRepository.save(area);
  }

  async deleteArea(id: number): Promise<{ message: string }> {
    const area = await this.findOneArea(id);

    area.status = false

    await this.documentalAreaRepository.save(area);

    return { message: 'Area removed' }
  }
}
