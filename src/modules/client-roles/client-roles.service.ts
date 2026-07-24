import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientRoleDto } from './dto/create-client-role.dto';
import { UpdateClientRoleDto } from './dto/update-client-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRole } from './entities/client-role.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'status'];

@Injectable()
export class ClientRolesService {

  constructor(
    @InjectRepository(ClientRole) private readonly clientRoleRepository: Repository<ClientRole>
  ) { }

  async createClientRole(createClientRoleDto: CreateClientRoleDto): Promise<ClientRole> {
    const existing = await this.clientRoleRepository.findOne({
      where: { name: createClientRoleDto.name }
    })

    if (existing) {
      throw new ConflictException('Client role already exists');
    }

    const clientRole = this.clientRoleRepository.create(createClientRoleDto);
    return this.clientRoleRepository.save(clientRole);
  }

  async findAllClientRoles(query: PaginationQueryDto): Promise<PaginatedResponse<ClientRole>> {
    const { page, limit, sortBy, order, search, onlyActive } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.clientRoleRepository.createQueryBuilder('clientRole');

    if (search) {
      qb.where('clientRole.name ILIKE :search', { search: `%${search}%` });
    }

    if (onlyActive) {
      qb.andWhere('clientRole.status = :status', { status: true });
    }

    qb.orderBy(`clientRole.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneClientRole(id: number): Promise<ClientRole> {
    const clientRole = await this.clientRoleRepository.findOne({
      where: { id }
    })

    if (!clientRole) {
      throw new NotFoundException('Client role not found');
    }

    return clientRole;
  }

  async updateClientRole(id: number, updateClientRoleDto: UpdateClientRoleDto): Promise<ClientRole> {
    const clientRole = await this.findOneClientRole(id);

    Object.assign(clientRole, updateClientRoleDto);

    return this.clientRoleRepository.save(clientRole);

  }

  async deleteClientRole(id: number): Promise<{ message: string }> {
    const clientRole = await this.findOneClientRole(id);

    clientRole.status = false

    await this.clientRoleRepository.save(clientRole);

    return { message: 'Client role deleted' };
  }
}
