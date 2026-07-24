import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { Repository } from 'typeorm';
import { PlansService } from '../plans/plans.service';
import { TurnoverService } from '../turnover/turnover.service';
import { UsersService } from '../users/users.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'business_name', 'rfc', 'city', 'state', 'establishment_status'];

@Injectable()
export class EstablishmentService {

  constructor(
    @InjectRepository(Establishment) private readonly establishmentRepository: Repository<Establishment>,
    private readonly plansService: PlansService,
    private readonly turnoverService: TurnoverService,
    private readonly usersService: UsersService,
  ) { }

  async createEstablishment(createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const rfcExists = await this.establishmentRepository.findOne({
      where: [
        { rfc: createEstablishmentDto.rfc },
      ],
    })

    if (rfcExists) {
      throw new ConflictException('RFC already in use');
    }

    const { plan_id, turnover_id, designated_person_id, ...establishmentData } = createEstablishmentDto;

    const plan = await this.plansService.findOnePlan(plan_id);
    const turnover = await this.turnoverService.findOneTurnover(turnover_id);
    const designated_person = await this.usersService.findOneUser(designated_person_id);

    const establishment = this.establishmentRepository.create({
      ...establishmentData,
      plan,
      turnover,
      designated_person,
    })

    return this.establishmentRepository.save(establishment);
  }

  async findAllEstablishments(query: PaginationQueryDto): Promise<PaginatedResponse<Establishment>> {
    const { page, limit, sortBy, order, search, onlyActive } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.establishmentRepository
      .createQueryBuilder('establishment')
      .leftJoinAndSelect('establishment.plan', 'plan')
      .leftJoinAndSelect('establishment.turnover', 'turnover')
      .leftJoinAndSelect('establishment.designated_person', 'designated_person');

    if (search) {
      qb.where(
        'establishment.name ILIKE :search OR establishment.business_name ILIKE :search OR establishment.rfc ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (onlyActive) {
      qb.andWhere('establishment.active = :active', { active: true });
    }

    qb.orderBy(`establishment.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneEstablishment(id: string): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOne({
      where: { id }
    })

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    return establishment;
  }

  async updateEstablishment(id: string, updateEstablishmentDto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findOneEstablishment(id);

    const { plan_id, turnover_id, designated_person_id, ...updateData } = updateEstablishmentDto;

    Object.assign(establishment, updateData);

    if (plan_id) {
      establishment.plan = await this.plansService.findOnePlan(plan_id);
    }

    if (turnover_id) {
      establishment.turnover = await this.turnoverService.findOneTurnover(turnover_id);
    }

    if (designated_person_id) {
      establishment.designated_person = await this.usersService.findOneUser(designated_person_id);
    }

    return this.establishmentRepository.save(establishment);
  }

  async deleteEstablishment(id: string): Promise<{ message: string }> {
    const establishment = await this.findOneEstablishment(id);

    establishment.active = false;

    await this.establishmentRepository.save(establishment);

    return { message: 'Establishment removed' };
  }
}
