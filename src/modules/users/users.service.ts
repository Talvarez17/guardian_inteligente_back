import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePassDTO } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RolesService } from '../roles/roles.service';
import { DocumentalAreaService } from '../documental-area/documental-area.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'first_last_name', 'email', 'status', 'created_at'];


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly documentalAreaService: DocumentalAreaService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    })
    if (existing) {
      throw new ConflictException('This email is already in use');
    }

    const role = await this.rolesService.findOneRole(createUserDto.role_id);

    const documental_area = createUserDto.documental_area_id
      ? await this.documentalAreaService.findOneArea(createUserDto.documental_area_id)
      : undefined;

    const hashPass = await bcrypt.hash(createUserDto.password, 10);

    const { role_id, documental_area_id, ...userData } = createUserDto;

    const user = this.usersRepository.create({
      ...userData,
      password: hashPass,
      role,
      documental_area,
    })

    return this.usersRepository.save(user);
  }

  async findAllUsers(query: PaginationQueryDto): Promise<PaginatedResponse<User>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'created_at';

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (search) {
      qb.where(
        'user.name ILIKE :search OR user.first_last_name ILIKE :search OR user.second_last_name ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    qb.orderBy(`user.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<User> {
    const user = await this.findOneUser(id);

    const { role_id, documental_area_id, ...updateData } = updateUser;

    Object.assign(user, updateData);

    if (role_id) {
      user.role = await this.rolesService.findOneRole(role_id);
    }

    if (documental_area_id) {
      user.documental_area = await this.documentalAreaService.findOneArea(documental_area_id);
    }

    return this.usersRepository.save(user);

  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findOneUser(id);

    user.status = false;
    await this.usersRepository.save(user);

    return { message: 'User deleted successfully' };
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async changePassword(id: string, updatePass: ChangePassDTO): Promise<{ message: string }> {

    const user = await this.usersRepository.createQueryBuilder('user').addSelect('user.password').where('user.id = :id', { id }).getOne()

    if(!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(updatePass.currentPassword, user.password);
    if(!isMatch) {
      throw new UnauthorizedException('Current passwors in not correct');
    }

    user.password = await bcrypt.hash(updatePass.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.findOneUser(id);

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password reset successfully' };
  }

}
