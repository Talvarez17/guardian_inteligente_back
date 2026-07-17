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

const SORTABLE_FIELDS = ['name', 'businessName', 'rfc', 'city', 'state', 'status', 'risk', 'monthlyBill', 'cameras'];

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

    const emailExists = await this.establishmentRepository.findOne({
      where: [
        { email: createEstablishmentDto.email },
      ],
    })

    if (emailExists) {
      throw new ConflictException('Email already in use');
    }

    const { planId, turnoverId, designatedPersonId, ...establishmentData } = createEstablishmentDto;

    const plan = await this.plansService.findOnePlan(planId);
    const turnover = await this.turnoverService.findOneTurnover(turnoverId);
    const designatedPerson = await this.usersService.findOneUser(designatedPersonId);

    const establishment = this.establishmentRepository.create({
      ...establishmentData,
      plan,
      turnover,
      designatedPerson,
    })

    return this.establishmentRepository.save(establishment);
  }

  async findAllEstablishments(query: PaginationQueryDto): Promise<PaginatedResponse<Establishment>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.establishmentRepository
      .createQueryBuilder('establishment')
      .leftJoinAndSelect('establishment.plan', 'plan')
      .leftJoinAndSelect('establishment.turnover', 'turnover')
      .leftJoinAndSelect('establishment.designatedPerson', 'designatedPerson');

    if (search) {
      qb.where(
        'establishment.name ILIKE :search OR establishment.businessName ILIKE :search OR establishment.rfc ILIKE :search OR establishment.email ILIKE :search OR establishment.contactName ILIKE :search',
        { search: `%${search}%` },
      );
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

    const { planId, turnoverId, designatedPersonId, ...updateData } = updateEstablishmentDto;

    Object.assign(establishment, updateData);

    if (planId) {
      establishment.plan = await this.plansService.findOnePlan(planId);
    }

    if (turnoverId) {
      establishment.turnover = await this.turnoverService.findOneTurnover(turnoverId);
    }

    if (designatedPersonId) {
      establishment.designatedPerson = await this.usersService.findOneUser(designatedPersonId);
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
