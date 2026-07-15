import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) { }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({
      where: { name: createRoleDto.name }
    })

    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find()
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id }
    })

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneRole(id);

    Object.assign(role, updateRoleDto);

    return this.roleRepository.save(role);

  }

  async deleteRole(id: number): Promise<{ message: string }> {
    const role = await this.findOneRole(id);

    role.status = false

    await this.roleRepository.save(role);

    return { message: 'Role deleted' };
  }
}
