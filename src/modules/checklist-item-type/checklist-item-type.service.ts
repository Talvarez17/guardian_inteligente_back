import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChecklistItemTypeDto } from './dto/create-checklist-item-type.dto';
import { UpdateChecklistItemTypeDto } from './dto/update-checklist-item-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistItemType } from './entities/checklist-item-type.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'status'];

@Injectable()
export class ChecklistItemTypeService {

  constructor(
    @InjectRepository(ChecklistItemType) private readonly checklistItemTypeRepository: Repository<ChecklistItemType>
  ) { }

  async createChecklistItemType(createChecklistItemTypeDto: CreateChecklistItemTypeDto): Promise<ChecklistItemType> {
    const existing = await this.checklistItemTypeRepository.findOne({
      where: { name: createChecklistItemTypeDto.name }
    })

    if (existing) {
      throw new ConflictException('Checklist item type already exists');
    }

    const checklistItemType = this.checklistItemTypeRepository.create(createChecklistItemTypeDto);
    return this.checklistItemTypeRepository.save(checklistItemType);
  }

  async findAllChecklistItemTypes(query: PaginationQueryDto): Promise<PaginatedResponse<ChecklistItemType>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.checklistItemTypeRepository.createQueryBuilder('checklistItemType');

    if (search) {
      qb.where('checklistItemType.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`checklistItemType.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneChecklistItemType(id: number): Promise<ChecklistItemType> {
    const checklistItemType = await this.checklistItemTypeRepository.findOne({
      where: { id }
    })

    if (!checklistItemType) {
      throw new NotFoundException('Checklist item type not found');
    }

    return checklistItemType;
  }

  async findAllActiveChecklistItemTypes(): Promise<ChecklistItemType[]> {
    return this.checklistItemTypeRepository.find({ where: { status: true }, order: { id: 'ASC' } });
  }

  async updateChecklistItemType(id: number, updateChecklistItemTypeDto: UpdateChecklistItemTypeDto): Promise<ChecklistItemType> {
    const checklistItemType = await this.findOneChecklistItemType(id);

    Object.assign(checklistItemType, updateChecklistItemTypeDto);

    return this.checklistItemTypeRepository.save(checklistItemType);
  }

  async deleteChecklistItemType(id: number): Promise<{ message: string }> {
    const checklistItemType = await this.findOneChecklistItemType(id);

    checklistItemType.status = false

    await this.checklistItemTypeRepository.save(checklistItemType);

    return { message: 'Checklist item type deleted' };
  }
}
